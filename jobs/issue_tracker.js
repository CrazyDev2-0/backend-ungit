require("dotenv").config()
const prisma = require("../db").getInstance();

(async () => {
    // Fetch the token
    const api_token = process.env.GITHUB_TOKEN;
    // Fetch all repos
    const repos = await prisma.subscription.findMany({
        distinct: ["ownerName", "repositoryName"],
        select: {
            ownerName: true,
            repositoryName: true,
        }
    })
    // Traverse each repo
    for (let i = 0; i < repos.length; i++) {
        const repo_details = repos[i];
        // Api call
        const api_response = await fetch(`https://api.github.com/repos/${repo_details.ownerName}/${repo_details.repositoryName}/issues?state=open&per_page=100`, {
            headers: {
                "Authorization": `Bearer ${api_token}`
            }
        })

        // Fetch all users that are subscribed to this repo
        // Traverse each user
        
    }
})()