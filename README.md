# Assignment 3

This project is a continuation, and remake of my previous project - a primative forum of sorts where users may leave posts. For this project, I used the local authentication strategy and lowdb. When I started on this project, I had tried to use OAuth2 - with GitHub specifically. I ran into some strange issues with it, and ultimately decided to just use local authentication. I opted to use lowdb because I somehow manage to have evaded learning how to use any sort of proper database in my years of computer science, and did not have enough time to learn over the span of this project.

For the styling of my project, I opted to use Bootstrap. Specifically, the `react-bootstrap` package which provides React wrappers for Bootstrap components and classes, which makes it quite pleasant to work with.

**Note:** I am not entirely certain how you will count this, but the website in its current form does not have content to be displayed to specific users, rather certain actions require authentication, e.g. editing a post requires you to be logged in as the author of the post. This is enforced both on the client and on the server. Due to the nature of the project, there was no material that I felt it would make sense to display to only some users.

With that being said, the content returned from the server is dependent on the user logged in, albeit in a more minor way. Specifically, when the user requests, for instance, the posts that have been made, the server will determine whether or not the user is the author of those each post. If the user is the author of any posts, they will also get "edit" and "delete" options for those posts. If the user manually tries to access a page they should not have access to, they will instead receive an "Unauthorized" page.

## Middleware

- **`static`:** Statically serves files from the "dist" folder
- **`body-parser`:** Parses JSON in bodies of requests
- **`passport`:** Performs user authentication
- **`session`:** Stores session info in the request object
- **`morgan`:** Automatic logging for requests
- **`helmet`:** Provides minor security benefits

## Technical Achievements

### React

I decided to try using React for the client side. I'm not altogether certain that the specific way I implemented it worked out well. Each page essentially makes a call to the server to fetch the content, be it posts, user data, etc., and then renders it. In practice, this can feel unresponsive, which is bad for the user experience.

React did, however, allow me to use some powerful tools, such as `yup` and `Formik` for automatic form validation and state management, respectively, as well as the `react-bootstrap` components.

### Parcel

Furthermore, I used the packaging tool Parcel to bundle and transpile my client-side Javascript. While I do generally like this tool, I'm not certain on the best way to integrate it with Glitch. With the current setup, it is required to build the entire website each time the website wakes up. Ideally, I'd like it to only build when needed.

### Password Encryption

I used the `bcrypt` package to encrypt my passwords. The actual usefulness of this feature is, however, quite hampered by the fact that this website does not use HTTPS. While the passwords may not be STORED in plaintext, they are sent from the client to the server in plaintext.

## Design Achievements

### Viewport

I modified the viewport settings in the `index.html` file to ensure that the website scales properly to mobile devices.
