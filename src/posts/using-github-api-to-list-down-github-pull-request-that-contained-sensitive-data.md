---
title: Using Github api to list down Github pull request that contained sensitive data
description: If you’ve accidentally committed sensitive data (like passwords or SSH keys) to a Git repository, you can remove it from the git history1. However, if your repository is hosted on GitHub, the data won’t be removed from the associated pull requests2. To streamline this process, an automated TypeScript script is proposed. It identifies sensitive data in pull requests, retrieves repository data using the GitHub API, and generates an output.csv file with relevant information. This script simplifies maintaining clean repositories. 🚀
date: '2024-4-08'
categories:
  - git
image: /images/Managing-Multiple-Git-SSH-Keys-for-Git-on-Windows.jpg
author: Me
published: true
---

If you ever committed a  sensitive data, such as a password or SSH key into a Git repository, you can remove it from the git history. There are few ways to do it documented here [Removing sensitive data from a repository]([Removing sensitive data from a repository - GitHub Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

# Background
When I once faced this issue, i choose to use BFG tool to remove the sensitive data & plaintext secrets from git history. However if your repository stored in Github, the data will not be removed from the Github pull request. You need to contact Github support to ask them to remove the affected pull request.
What you need to give them is just the id of the pull request and the git commit id that you want to be removed. This might be easy task if you do know which pull request that introduced the bad commit but it will become difficult if you do not really know that. To make it worse, it can be a lot of them if your repository is old enough. You also might not only need to handle it for one single repository but a bunch of repositories. To locate all of this manually will be time consuming.
# The Script
What we need is to have a automated script that can go through all the pull request of the repository and located the pull request id and the id of the bad commit.
I have found this guide in the internet [Removing Sensitive Data & Plaintext Secrets from GitHub]([Clean GitHub commit history, repositories and pull requests (secjuice.com)](https://www.secjuice.com/github-complete-cleaning-sensitive-secrets/)) but i think some of the code there might not be working properly.  So i decide to get it working again.
The script should be able to do the followings:
1. get the list of the data that we want to removed
2. get the repository data using Github api
3. get the list of pull request of that repository
4. get the list of commit of that pull request
5. get the file patch of that commit
6. check if the patch contained the sensitive data
7. store the finding in a csv file
8. repeat step 3 to 7 again until you loop through all the pull request

so this is the messy typescript code i write for that
- you need to enable ES module in `package.json` for this to work
- you need to install `github-api` and `dotenv` package
- you need to create github token that have access to the repo

```typescript
import GitHub from "github-api";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.GITHUB_TOKEN
const gh = new GitHub({ token });
const ownerLogin = process.env.GITHUB_USER
const repoName = "my.repo"
let secretsData;
try {
    secretsData = fs.readFileSync(path.resolve(process.env.SECRET_PATH)).toString();
} catch (e) {
    console.error(e);
    process.exit(1);
}

const patterns = secretsData.split('\r\n');
async function App(){
    const e2eRepo = await gh.getRepo(ownerLogin, repoName);
    let prPage = 1;
    let stillHavePrPage = true;
    let output = 'repoName,prNumber,commit,hasSecret';
    while (stillHavePrPage){
        const prs = await e2eRepo.listPullRequests({
            state: 'all',
            per_page: 50,
            page: prPage
        });
        console.log(`looping the ${prPage} PR page with page size ${prs.data.length}`);
        prPage++;
        if (prs.data.length === 0) {
            stillHavePrPage = false;
        }else{
            for (let i = 0; i < prs.data.length; i++) {
                let pr = prs.data[i];
                let commitList = await e2eRepo.listCommits({
                    sha: pr.head.sha,
                    per_page: 60
                })
                console.log(`looping PR ${i}, the commit page with page size ${commitList.data.length}`);
                for (let j = 0; j < commitList.data.length; j++) {
                    let commit = await e2eRepo.getSingleCommit(commitList.data[j].sha)
                    console.log(`process ${commit.data.sha}`);
                    const { files } = commit.data;
                    files.forEach((file) => {
                        let hasSecret = false;
                        patterns.forEach((pattern) => {
                            const re = new RegExp(pattern, 'g');
                            if (re.test(file.patch)) {
                                hasSecret = true;
                            }
                        });
                        output += `\n${e2eRepo.__fullname},${pr.number},${commit.data.sha},${hasSecret}`;
                    });
                    if(commitList.data[j].sha === pr.base.sha){
                        console.log(`stop because found base ${pr.base.sha}`);
                        break;
                    }
                }
            }
        }
    }

    fs.writeFileSync(path.resolve('./output.csv'), output);
}
await App()
```

when you have run this script, the `output.csv` should contained all the commit form all pull request and it also contained the flag that tell if the commit have the secret data or not.

You can filter it out using excel of just sent it to the github support to remove the pull request