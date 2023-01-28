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
        const api_response_json = await api_response.json();

        // Fetch all users that are subscribed to this repo
        const users = await prisma.subscription.findMany({
            where: {
                ownerName: repo_details.ownerName,
                repositoryName: repo_details.repositoryName
            },
            select: {
                labels: true,
                User: {
                    select: {
                        emailid: true,
                        mobileno: true
                    }
                }
            }
        })
        // TODO email and SMS
        // Traverse each user and create a list of labels
        const labels = new Set();
        for (let j = 0; j < users.length; j++) {
            const user = users[j];
            const splitted_label = user.labels.split(",");
            for (let k = 0; k < splitted_label.length; k++) {
                const label = splitted_label[k];
                labels.add(label);
            }
        }
        // Traverse each issue
        let label_issue_map = {};
        for (let j = 0; j < api_response_json.length; j++) {
            const issue = api_response_json[j];
            // Traverse each label
            for (let k = 0; k < issue.labels.length; k++) {
                const label = issue.labels[k];
                if (!( label.name in  label_issue_map)) {
                    label_issue_map[label.name] = [];
                }
                label_issue_map[label.name].push({
                    "title": issue.title,
                    "url": issue.html_url,
                });
            }
        }
        // Traverse each user and prepare the notification
        for (let j = 0; j < users.length; j++) {
            const user = users[j];
            const splitted_label = user.labels.split(",");
            for (let k = 0; k < splitted_label.length; k++) {
                const label = splitted_label[k];
                if (label in label_issue_map) {
                    await prisma.notification.create({
                        data: {
                            content: JSON.stringify(label_issue_map[label])
                        }
                    })   
                }
            }
        }
    }
})()