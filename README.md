<h1 align="center">
🌎 MERN social network
</h1>

<p>This is a fullstack web application. The social network is built from the ground up. You can log in, scroll through your feed, view other users' posts, sort them, create your own posts, leave comments, and so on.</p>

### This project was created using:
<ul>
	<li>React</li>
  <li>React Router v6</li>
	<li>Redux Toolkit</li>
	<li>Nodejs</li>
	<li>MongoDB/mongoose</li>
	<li>Express + Validator</li>
  <li>JSON Web Token</li>
  <li>Multer</li>
  <li>BCrypt</li>
  <li>material UI</li>
</ul>

# Quick start of the project (run fullstack app on your machine)

## Clone or download
```terminal
$ git clone https://github.com/lllakon/MERN-socialNetwork.git
$ yarn # or npm i
```

## Prerequisites
<ul>
  <li>MongoDB</li>
  <li>Nodejs</li>
  <li>npm</li>
</ul
  
You need client and server runs concurrently in different terminal session, in order to make them talk to each other. 

## Frontend usage(PORT: 3000)
```terminal
$ cd frontend-fullstack-blog    // go to client folder
$ npm i                         // npm install packages
$ npm start                     // run it locally
```
## Backend usage(PORT: 4444)
```terminal
$ cd backend-fullstack-blog    // go to client folder
$ npm i                         // npm install packages
$ npm run start:dev                     // run it locally
```
# Screenshots and project description
Registration page
![Registration page](https://i.imgur.com/s6rh320.png)
  
  
Registration and login fields are checked for correct input
![Registration validation](https://i.imgur.com/F8wQsgy.png)
  
  
Home page, by default the posts are sorted by creation date
![Home page](https://i.imgur.com/eXwWy38.png)
  
  
Sorted by popularity. Sorting is based on the number of views and the number of comments
![Sorted by popularity](https://i.imgur.com/9p3nHGB.png)
  
  
The feed with posts is loaded when the user scrolls down. Infinity scroll. 
![Infinity scroll](https://i.imgur.com/hUMvLww.jpg)
  
  
If you scroll through the feed and run out of posts, you'll see a message about it 
![Out of posts message](https://i.imgur.com/lMhwRl5.png)
  
  
The feed will check if the user is authorized. 
![Feed will check if the user is authorized](https://i.imgur.com/numnfah.png)
  
You can edit or delete your posts
![Edit or delete your posts](https://i.imgur.com/b1WmLAV.png)
  
  
This is what the post looks like if you click on it. You can also change or delete it here. 
![Full post](https://i.imgur.com/EgK0zS8.png)
 
  
Commentary section. You can see other people's comments or leave your own. 
![Commentary section](https://i.imgur.com/XiF3a44.png)
  
  
You can delete your comments
![Delete comment](https://i.imgur.com/deGbfDs.png)
  
  
You need to be logged in to leave new comments on posts
![Auth check](https://i.imgur.com/X7HoCIF.png)
  
  
Creating a new post. The header and text fields are checked for the number of characters. Tags are automatically separated by a space
![Creating a new post](https://i.imgur.com/xwr0UZ8.png)
  
  
You can click on any tag. The search by popular tags looks the same. (Search by tag "Express")
![Search by tag "Express"](https://i.imgur.com/YIQZqli.png)
  
  
You can see information about your account, change your avatar and email. 
![User page](https://i.imgur.com/nwceXYl.png)
  
  
## This was a short review of my MERN project. Thanks for your attention! 😊
 
