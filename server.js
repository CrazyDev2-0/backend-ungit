const express = require('express');
const app = express();
const prisma = require("./db").getInstance();
const {AuthMiddleware} = require("./middleware");


// Config
global.__basedir = __dirname;
app.disable('x-powered-by')
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(AuthMiddleware.resolveUser);


// Routes
app.post("/profile/update", async(req, res) => {
    try{
        const { username, mobile_no, email_id } = req.body;
        if (!username) {
            return res.status(400).json({ error: "Invalid request" });
        }
        let currentUser = await prisma.user.findFirst({
            where: {
                username: username
            },
            select: {
                id:  true
            }
        })
        if(currentUser == null){
            currentUser = await prisma.user.create({
                data: {
                    username: username,
                    mobileno: mobile_no,
                    emailid: email_id
                }
            })
        }else{
            await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data: {
                    mobileno: mobile_no,
                    emailid: email_id
                }
            })
        }
        res.send({
            "success": true,
            "message": "Profile updated successfully"
        })
    }catch(err){
        res.send({
            "success": false,
            "message": "Something went wrong"
        })
    }
})


app.post("/rollbacksubscription", AuthMiddleware.authRequired, async(req, res) => {
    const ownerName = req.body.owner_name;
    const repository_name = req.body.repository_name;
    let labels = req.body.labels;

    if(labels === null || labels === undefined || labels === ""){
        labels = "*"
    }

    const currentRecord = await prisma.subscription.findFirst({
        where: {
            ownerName: ownerName,
            repositoryName: repository_name,
            userId: req.user.id
        }
    })
    if(currentRecord != null){
        return res.status(200).json({
            "success": true,
            "message": "Already subscribed"
         });
    }

    await prisma.subscription.create({
        data: {
            ownerName: ownerName,
            repositoryName: repository_name,
            labels: labels,
            User: {
                connect: {
                    id: req.user.id
                }
            }

        }
    })

    res.status(200).json({
        "success": true,
        "message": "Subscribed successfully"
    })

})

// Api to unsubscribe
app.post("/unsubscribe", AuthMiddleware.authRequired, async(req, res) => {
    const ownerName = req.body.owner_name;
    const repositoryName = req.body.repository_name;

    const currentRecord = await prisma.subscription.findFirst({
        where: {
            ownerName: ownerName,
            repositoryName: repositoryName,
            userId: req.user.id
        }
    })
    if(currentRecord == null){
        return res.status(200).json({
            "success": true,
            "message": "Already unsubscribed"
         });
    }

    await prisma.subscription.delete({
        where: {
            id: currentRecord.id
        }
    })

    res.status(200).json({
        "success": true,
        "message": "Unsubscribed successfully"
    })
})



// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Unexpected Error" });
})

const PORT = 3000;

app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));