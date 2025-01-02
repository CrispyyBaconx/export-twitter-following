# Export Twitter Following

This script will export any users following a given user to a json file for your viewing pleasure
This could probably also be used to export followers, but I didn't make it to do that because I didn't need it to but you can probably modify it to do that yourself.

## Prerequisites

- Node.js
- A Twitter account
- Some time

## Usage

You'll need to obtain the following:
- Your cookie
- An x-csrf-token
- The user Id of whoever you want to export the following of

If you need help finding these, see the [Extra Info](#extra-info) section

### Steps
1. Clone the repository
2. Run `npm i`
3. Run `tsx index.ts` (or whatever you want to use to run it im not your dad)
4. Follow the prompts, or input the values as arguments 
5. Wait a bit
6. It should export a json file to the same directory as the script called following.json
7. Have fun

## Extra Info

### Cookie 
The cookie should be formatted as it is in the cookie.json.example file - use something like [this](https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) to export your cookie. If you're using this one just open it on twitter and hit export at the bottom right in the extension.

### User id & x-csrf-token
If you need help finding the user id, open up the network tab in devtools on the page of the person you want to export and look for a request called "list.json" with some stuff after it - should look like this: 

![list.json?include_profile_intersititial_type=1](example.png)

Click on the request to open it up, you can see it as a parameter in the url. Copy it and use it here. You can also obtain the x-csrf-token from the request headers if you scroll down a bit in this same request.
