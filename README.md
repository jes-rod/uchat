
![Logo](https://firebasestorage.googleapis.com/v0/b/uchat-6afe0.appspot.com/o/unichat-logo-slogan-rscale.jpg?alt=media&token=dbdea280-8f60-4559-afaa-36c1ce7e8d4a)

# Uchat || Web chat application

Based on the [Messenger clone](https://www.youtube.com/watch?v=PGPGcKBpAk8) app created by [Antonio Erdeljac](https://github.com/antonioerdeljac). 

Uchat is a fully functional real time chat application built in React/Next.js that allows you to chat with friends and contacts using their email address as an identifier. 

You can create individual chats or group chats with their respective management settings for administrators to effectively moderate the content shared. Share files and multimedia thanks to the implemented Firebase storage that will handle all file requests. Personalize your own profile by changing your display name and avatar. 

Don’t want to create an account ? No worries! You can sign in with your existing Google or GitHub accounts.




## Tech Stack

**Client:** TypeScript, React, Next.js, Tailwind

**Server:** Node.js, MongoDb, Prisma, Firebase 


## Features/Optimizations

The original app had the following functionalities already implemented:

- Sign in with local registration, GitHub or Google signin.
- Account customization: You can change your display name and your avatar/profile picture.
- Real time chat functionality that allows 1v1 chat or group creation to include many recipients and senders.
- Sending images that will be directly displayed in the chat.

The following is a list of all additional features included in current version 1.0.1 of Unichat

- Account deletion.
- Group administration which includes:
    - Admin functionality: Admins will be able to manage all specifications related to the group, regular members will only be able to send messages through the group and leave the group.
    - Add/remove members
    - Add/remove admins
    - Leave a group
    - Message restriction: Admins can restrict messaging to either allow only admins or all users to send messages.
- Multimedia: Instead of just images, now you can send any other type of file which will generate a hyperlink to access the file directly from the chat.




## Demo

Test the live version [here]('https://uchat-ten.vercel.app/').


## Run Locally

Clone the project

```bash
  git clone https://github.com/jes-rod/uchat
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PUSHER_APP_ID`
`PUSHER_SECRET`

`FIREBASE_API_KEY`
`FIREBASE_AUTH_DOMAIN`
`FIREBASE_PROJECT_ID`
`FIREBASE_STORAGE_BUCKET`
`FIREBASE_MESSAGING_SENDER_ID`
`FIREBASE_APP_ID`

`GITHUB_ID`
`GITHUB_SECRET`

`GOOGLE_CLIENT_ID`
`GOOGLE_CLIENT_SECRET`

`SALT`


## Feedback

If you have any feedback, please reach out to me at jeser.rodriguez@outlook.com .

