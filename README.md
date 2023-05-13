# RemindmeBot

This script authenticates as you on Facebook Messenger and whenever it detects a **reply** in format
```
/remindme <moment>
```
eg:
```
/remindme 1h
/remindme friday
```
it stores message reference to MongoDB and replies to that command invokation when appropriate tiem has passed.

Note: this application has no authorization for who can run the command.

# Usage
1. Get your session cookies from FB and store them in `appstate.json`
2. Run
    ```
    docker-compose up -d
    ```

# Getting cookies for `appstate.json`
## Solution 1: Copy from browser cookie explorer
1. Navigate to facebook.com in any browser
2. Open developer tools
3. Find stored cookies
4. Fill the `appstate.json` fields for all predefined cookies
    
    Fields:
    - `value`
    - `expires`
    - `size`

## Solution 2: Run the cookie_retriever
1. Open `cookie_retriever/src/index.js`
2. Insert your email and password
3. Navigate terminal to `/cookie_retriever` dir
4. Run `npm start`
5. `appstate.json` appears in your `/cookie_retriever` dir