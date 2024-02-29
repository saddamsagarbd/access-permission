import express from "express";
import mysql from 'mysql'
import cors from 'cors'
import bodyParser from "body-parser";

import session from "express-session";
import cookieParser from "cookie-parser";

import nocache from 'nocache';

const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}))

app.use(nocache());
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

app.use(session({
    secret: "secret",// secrete key encrypt the session cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // max 1 day
    }
}))

// handle mysql error
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error(err); // Log the error for debugging purposes

    if (err instanceof Error) {
        // Handle other types of errors (not MySQL errors)
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        // Handle other types of errors (not MySQL errors)
        res.status(500).send('Internal Server Error');
    }
});

const dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "access-permission"
})

app.get("/", (req, res) => {
    // console.log("after", req.session.username);
    if (req.session.username) {
        return res.json({ isLogin: true, username: req.session.username, user_role: req.session.user_role })
    } else {
        return res.json({ isLogin: false })
    }
})

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {

        if (err) {
            console.error(err);
            res.status(500).send('Error destroying session');
        } else {
            // Clear the cookie
            req.session = null;
            res.clearCookie('user');
            res.clearCookie('connect.sid');
            return res.json({ isLogin: false });
        }
    });
})

app.get("/get-menus", (req, res) => {
    // console.log("after", req.session.username);
    const sql = "SELECT * FROM menus order by id ASC";
    dbConn.query(sql, [], (err, result) => {
        if (err) return res.json({ Status: "error", Message: err });
        if (result.length > 0) {
            // console.log("before", result[0]);
            const menus = JSON.stringify(result)
            const permissionSql ="SELECT permission FROM menu_permissions where user_id = ?"
            // req.session.user_id
            dbConn.query(permissionSql, [req.session.user_id], (err, result) => {
                if (err) return res.json({ Status: "error", Message: err });
                if (result.length > 0) {
                    return res.json({ isLogin: true, menus: menus, permission: JSON.stringify(result) })
                }else{
                    return res.json({ isLogin: true, menus: menus, permission: "" })
                }
            })
        } else {
            return res.json({ isLogin: true, Message: "Record not found" });
        }
    })
    if (req.session.username) {
    } else {
        return res.json({ isLogin: false })
    }
})

app.get("/menu", (req, res) => {
    console.log("id", req.session.user_id);
    // if (req.session.username) {
        const sql ="SELECT permission FROM menu_permissions where user_id = ?"
        
        dbConn.query(sql, [req.session.user_id], (err, result) => {
            if (err) return res.json({ Status: "error", Message: err });

            console.log("cond", (req.session.username));

            if (req.session.username) {
                
                if (result.length > 0) {
                    return res.json({ isLogin: true, username: req.session.username, user_role: req.session.user_role, permission: JSON.stringify(result[0].permission) })
                }else{
                    return res.json({ isLogin: true, username: req.session.username, user_role: req.session.user_role })
                }
            }else{
                return res.json({ isLogin: false })
            }
        })
    // } else {
        
    // }
})

app.get("/get-users", (req, res) => {

    const sql = "SELECT * FROM users WHERE user_role = 0 order by id ASC";
    dbConn.query(sql, [], (err, result) => {
        if (err) return res.json({ Status: "error", Message: err });
        if (result.length > 0) {
            const users = JSON.stringify(result);
            // console.log(users)
            if (req.session.username) {
                return res.json({ isLogin: true, users: users })
            } else {
                return res.json({ isLogin: false })
            }
        } else {
            return res.json({ isLogin: true, Message: "Record not found" });
        }
    })
    if (req.session.username) {
    } else {
        return res.json({ isLogin: false })
    }

})

app.get("/settings", (req, res) => {
    if (req.session.username) {
        return res.json({ isLogin: true, username: req.session.username, user_role: req.session.user_role })
    } else {
        return res.json({ isLogin: false })
    }
})



app.post("/register", (req, res) => {
    const sql = "INSERT INTO users ( `username`, `password` ) VALUES (?)";

    const values = [
        req.body.username,
        req.body.password
    ];
    // console.log(values);

    dbConn.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: "error", Message: "Record not inserted" });
        return res.json({ Status: "success", data: result });
    })
})

app.post("/login", (req, res) => {
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

    dbConn.query(sql, [req.body.username, req.body.password], (err, result) => {
        if (err) return res.json({ Status: "error", Message: err });
        if (result.length > 0) {
            req.session.user_id = result[0].id;
            req.session.username = result[0].username;
            req.session.user_role = result[0].user_role;
            // req.session.permission = result[0].permission;
            // console.log("before", req.session.username);
            res.cookie("user", result[0].username)
            return res.json({ Login: true, data: result });
        } else {
            return res.json({ Login: false, Message: "Record not found" });
        }
    })
})

app.post("/get-permission-by-userid", (req, res) => {
    // console.log(req.body.user_id)
    const sql = "SELECT `permission` FROM menu_permissions WHERE user_id = ?";
    dbConn.query(sql, [req.body.user_id], (err, result) => {
        if (err) return res.json({ Status: "error", Message: err });
        if (result.length > 0) {
            // const permission = JSON.stringify(result[0].permission);
            const permission = result[0]?.permission || "";
            if (req.session.username) {
                return res.json({ isLogin: true, permission: permission });
            } else {
                return res.json({ isLogin: false });
            }
        } else {
            return res.json({ isLogin: true, Message: "Record not found" });
        }
    })
})

app.post("/set-permission", (req, res) => {
    const user_id = req.body.user_id;
    const permission = JSON.stringify(req.body.permission);

    const sql = "SELECT * FROM menu_permissions WHERE user_id = ?";

    dbConn.query(sql, [user_id], (err, result) => {

        if (err) return res.json({ Status: "error", Message: err });

        if (result.length > 0) {
            // update row
            const updateSql = "UPDATE menu_permissions SET `permission` = ? WHERE `user_id` = ?";

            const values = [
                permission,
                user_id
            ];

            dbConn.query(updateSql, values, (err, results) => {
                if (err) return res.json({ Status: "error", Message: "Record not updated" });
                console.log("Updated successfully!");
                return res.json({ Status: "success", Message: "Updated successfully!" });
            });
        } else {
            // insert new row
            const insertSql = "INSERT INTO menu_permissions ( `user_id`, `permission` ) VALUES (?, ?)";

            const values = [
                user_id,
                permission
            ];

            dbConn.query(insertSql, values, (err, result) => {
                // console.log(err);
                if (err) return res.json({ Status: "error", Message: "Record not inserted" });
                return res.json({ Status: "success", data: result });
            })

        }

    })

})

app.post("/create", (req, res) => {
    const sql = "INSERT INTO menus ( `title`, `slug` ) VALUES (?)";

    const values = [
        req.body.title,
        req.body.slug
    ];
    // console.log(values);

    dbConn.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: "error", Message: "Record not inserted" });
        return res.json({ Status: "success", data: result });
    })

})


app.listen(8081, () => {
    console.log("server is connected")
})