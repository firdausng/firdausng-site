---
title: 'Managing Multiple Git SSH Keys for GitHub on Windows'
date: '2023-07-24'
tags: ['git']
published: true
image: /images/Managing-Multiple-Git-SSH-Keys-for-Git-on-Windows.jpg
author: Me
description: "If you're an avid GitHub user and have multiple GitHub accounts, you might have encountered challenges when working with repositories from different accounts on the same machine. By default, Git uses a single SSH key for authentication, but fortunately, there's a solution! In this tutorial, we'll walk you through the process of setting up and managing multiple Git SSH keys on a Windows machine for different GitHub accounts."
---
## Table of contents

If you're an avid GitHub user and have multiple GitHub accounts, you might have encountered challenges when working with repositories from different accounts on the same machine. By default, Git uses a single SSH key for authentication, but fortunately, there's a solution! In this tutorial, we'll walk you through the process of setting up and managing multiple Git SSH keys on a Windows machine for different GitHub accounts.
## Step 1: Generate the SSH keys
First, let's create two separate SSH keys for each of your GitHub accounts. Open a Command Prompt or PowerShell window, and use the ssh-keygen command to generate the keys:

```shell
# Generate first SSH key
ssh-keygen -t rsa -C "your_email@example.com" -f C:\Users\your_user\.ssh\github_key1

# Generate second SSH key
ssh-keygen -t rsa -C "your_email@example.com" -f C:\Users\your_user\.ssh\github_key2
```

Replace `your_user` with your actual username and `your_email@example.com` with the email associated with the first GitHub account. For the second GitHub account, you can use the same email or a different one.

## Step 2: Add the SSH keys to the SSH agent

Next, we'll add both generated SSH keys to the SSH agent to manage them conveniently:

```shell
# Start the SSH agent (if not running already)
eval $(ssh-agent)

# Add first SSH key
ssh-add C:\Users\your_user\.ssh\github_key1

# Add second SSH key
ssh-add C:\Users\your_user\.ssh\github_key2
```

If you set a passphrase for the SSH keys, you'll be prompted to enter it during this step.


## Step 3: Configure the SSH config file

Now, let's use the SSH config file to associate each key with the respective GitHub account. Open a text editor and create a new file named `config` inside your `.ssh` directory (usually located at `C:\Users\your_user\.ssh\config`). If the file already exists, you can edit it.

Add the following configuration for the first GitHub account:

```shell
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/github_key1
```

Replace `github_key1` with the appropriate filename of the SSH private key for your first GitHub account. Then, configure the second GitHub account just below the first one:

```shell
Host github.com-seconduser
HostName github.com
User git
IdentityFile ~/.ssh/github_key2
```

Replace `github_key2` with the appropriate filename of the SSH private key for your second GitHub account.

## Step 4: Update Git remote URLs

With the SSH config file set up, you need to update your Git remote URLs to use the custom host defined in the SSH config. For existing repositories, use the following command:

```shell
git remote set-url origin git@github.com-seconduser:user2/repo2.git
```

For new repositories, clone them using the custom host:

```shell
git clone git@github.com-seconduser:user2/repo2.git
```

## Step 5: Add public keys to your GitHub accounts

Finally, go to GitHub and add the respective public keys (`github_key1.pub` and `github_key2.pub`) to the corresponding GitHub accounts, just as mentioned in the previous steps.

Now, you can effortlessly work with different GitHub accounts on your Windows machine using the appropriate SSH key for each repository. Enjoy a seamless and efficient GitHub experience without the hassle of switching accounts!

I hope you found this tutorial helpful. Happy coding!


> Note: Remember to replace your_user and your_email@example.com with your actual
> username and email address. Additionally, modify the repository URLs in Step 4 to
> match your specific repository locations.