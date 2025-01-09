import axios from "axios";
import { TimelineEntry, type TwitterResponse, type UserResult, type TwitterCookie, TwitterVariables } from "./TwitterResponse";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import inquirer from "inquirer";
import fs from "fs";
import { theme } from './theme'
import progress from 'progress-estimator';
import 'dotenv/config'

const getTwitterInfo = async (userId: string, limit: number = Infinity, xCsrfToken: string, mode: string) => {
    const data: UserResult[] = []
    let cursor: string | null = null

    // load cookie
    const unformattedCookies: TwitterCookie[] = JSON.parse(fs.readFileSync("cookie.json", "utf8")).filter((c: TwitterCookie) => c.name !== "_twitter_sess")
    const authToken = unformattedCookies.find(c => c.name === "auth_token")?.value
    if (!authToken) {
        console.error("Auth token not found in cookie, please run the script again with a valid cookie");
        process.exit(1);
    }
    const formattedCookie = Object.fromEntries(unformattedCookies.map(c => [c.name, c.value]))

    const features = {
        responsive_web_graphql_exclude_directive_enabled: true,
        verified_phone_label_enabled: false,
        creator_subscriptions_tweet_preview_api_enabled: true,
        responsive_web_graphql_timeline_navigation_enabled: true,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
        c9s_tweet_anatomy_moderator_badge_enabled: true,
        tweetypie_unmention_optimization_enabled: true,
        responsive_web_edit_tweet_api_enabled: true,
        graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
        view_counts_everywhere_api_enabled: true,
        longform_notetweets_consumption_enabled: true,
        responsive_web_twitter_article_tweet_consumption_enabled: false,
        tweet_awards_web_tipping_enabled: false,
        freedom_of_speech_not_reach_fetch_enabled: true,
        standardized_nudges_misinfo: true,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
        rweb_video_timestamps_enabled: true,
        longform_notetweets_rich_text_read_enabled: true,
        longform_notetweets_inline_media_enabled: true,
        responsive_web_media_download_video_enabled: false,
        responsive_web_enhance_cards_enabled: false,     
    }

    const logger = progress({
        theme: theme,
    });

    while (data.length < limit) {
        console.clear()
        console.log(`Getting following for user ${userId} - ${data.length} / ${limit}`)

        const variables: TwitterVariables = {
            userId: userId,
            cursor: cursor,
            count: 50, // ? Max per request
            includePromotedContent: false
        }

        let response: TwitterResponse | null = null;
        switch (mode) {
            case "following":
                response = await axios({
                    method: "GET",
                    url: `https://twitter.com/i/api/graphql/0yD6Eiv23DKXRDU9VxlG2A/Following?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`,
                    headers: {
                        'accept': '*/*',
                        'accept-language': 'en-US,en;q=0.9',
                        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                        'priority': 'u=1, i',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'none',
                        'sec-gpc': '1',
                        'x-csrf-token': xCsrfToken,
                        'cookie': Object.entries(formattedCookie).map(([key, value]) => `${key}=${value}`).join('; ')
                    }
                })
                break;
            case "followers":
                response = await axios({
                    method: "GET",
                    url: `https://twitter.com/i/api/graphql/j9ien6V5wUi7rs_1HQd9Sg/Followers?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`,
                    headers: {
                        'accept': '*/*',
                        'accept-language': 'en-US,en;q=0.9',
                        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                        'priority': 'u=1, i',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'none',
                        'sec-gpc': '1',
                        'x-csrf-token': xCsrfToken,
                        'cookie': Object.entries(formattedCookie).map(([key, value]) => `${key}=${value}`).join('; ')
                    }
                })
                break;
            case "verified":
                response = await axios({
                    method: "GET",
                    url: `https://twitter.com/i/api/graphql/SNo9jRAYTGlTSB1IoBSqCw/BlueVerifiedFollowers?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`,
                    headers: {
                        'accept': '*/*',
                        'accept-language': 'en-US,en;q=0.9',
                        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                        'priority': 'u=1, i',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'none',
                        'sec-gpc': '1',
                        'x-csrf-token': xCsrfToken,
                        'cookie': Object.entries(formattedCookie).map(([key, value]) => `${key}=${value}`).join('; ')
                    }
                })
                break;
        }

        if (!response) {
            console.error("No response from Twitter");
            process.exit(1);
        }

        const entries = response.data.data.user.result.timeline.timeline.instructions
            .find(instruction => instruction.type === "TimelineAddEntries")?.entries;

        if (!entries || entries.length === 0) {
            console.log("No more following to fetch");
            break;
        }

        // Get user entries
        const userEntries = entries.filter((entry: TimelineEntry) => {
            return entry.content.entryType === "TimelineTimelineItem";
        });

        const isCursorEntry = (entry: TimelineEntry): entry is TimelineEntry & {
            content: { entryType: "TimelineTimelineCursor"; value: string }
        } => entry.content.entryType === "TimelineTimelineCursor";

        // Get cursor entry
        const bottomCursor = entries.find((entry: TimelineEntry) => 
            isCursorEntry(entry) && entry.content.cursorType === "Bottom"
        );

        if (!bottomCursor || !isCursorEntry(bottomCursor)) {
            console.log("No bottom cursor found - end of pagination");
            break;
        }

        // Add user data
        const isTimelineItem = (entry: TimelineEntry): entry is TimelineEntry & {
            content: { entryType: "TimelineTimelineItem"; itemContent: any }
        } => entry.content.entryType === "TimelineTimelineItem";

        const newUsers = userEntries
            .filter(isTimelineItem)
            .map((entry) => entry.content.itemContent.user_results.result);
        
        data.push(...newUsers);
        console.log(`Getting ${data.length} following...`);

        // Update cursor for next request
        cursor = bottomCursor.content.value;

        if (userEntries.length < 50) {
            console.log("End of pagination; no more following");
            break;
        }

        // Random delay between requests
        const sleepPromise = new Promise<void>(resolve => setTimeout(resolve, 5000 + Math.random() * 5000));
        await logger(sleepPromise, 'Waiting for 5-10 seconds before next request...', { estimate: 5000 + Math.random() * 5000 })
    }

    return data;
};

const main = async () => {
    // load env
    let xCsrfToken = process.env.X_CSRF_TOKEN || '';

    // get args
    const argv = yargs(hideBin(process.argv))
        .option('userId', {
            alias: 'u',
            type: 'string',
            description: 'The user ID to get following for (check readme if you need help)',
        })
        .option('csrfToken', {
            alias: 'x',
            type: 'string',
            description: 'The x-csrf-token to use for the request (check readme if you need help - overrides .env)',
        })
        .option('limit', {
            alias: 'l',
            type: 'number',
            description: 'The max number of following to get',
        })
        .option('output', {
            alias: 'o',
            type: 'string',
            description: 'What info to output about the user (leave blank for all)',
            choices: ["", "username"]
        })
        .option('mode', {
            alias: 'm',
            type: 'string',
            description: 'What mode to run the script in (leave blank for following)',
            choices: ["following", "followers", "verified"],
            default: "following"
        })
        .option('help', {
            alias: 'h',
            type: 'boolean',
            description: 'Show help',
        })
        .parseSync();
    
    let userId: string | undefined = argv.userId;
    let limit: number | undefined = argv.limit;
    let outputInfo: string | undefined = argv.output;
    let mode: string | undefined = argv.mode;

    if (argv.csrfToken) {
        xCsrfToken = argv.csrfToken;
    }

    if (argv.mode) {
        mode = argv.mode;
    }

    if (!userId) {
        userId = await inquirer.prompt<{ userId: string }>([
            { name: 'userId', message: 'Enter the user ID to get following for', type: 'input', required: true, validate: (input) => input.length > 0 }
        ]).then((res) => res.userId)
    }

    if (!xCsrfToken) {
        xCsrfToken = await inquirer.prompt<{ xCsrfToken: string }>([
            { name: 'xCsrfToken', message: 'Enter the x-csrf-token to use for the request', type: 'input', required: true, validate: (input) => input.length > 0 }
        ]).then((res) => res.xCsrfToken)
    }

    if (!limit) {
        limit = await inquirer.prompt<{ limit: number }>([
            { name: 'limit', message: 'Enter the number of following to get (optional, leave blank for all)', type: 'number' }
        ]).then((res) => res.limit)
    }

    if (!userId) {
        console.error("User ID is required, please run the script again with a valid user ID");
        process.exit(1);
    }

    if (!xCsrfToken) {
        console.error("x-csrf-token is required, please run the script again with a valid x-csrf-token");
        process.exit(1);
    }

    let output: Array<string | UserResult> = []
    switch (mode) {
        case "following":
            const following = await getTwitterInfo(userId, limit, xCsrfToken, mode)

            if (outputInfo === "username") {
                following.forEach((user: UserResult) => {
                    try {
                        output.push(user.legacy.screen_name)
                    } catch (e) {
                        console.error("Error parsing user: ", user);
                    }
                })
            } else {
                output = following
            }
            console.log(`Got ${following.length} following for user ${userId} - exporting to following.json...`)
            fs.writeFileSync("following.json", JSON.stringify(output, null, 4))        

            break;
        case "followers":
            const followers = await getTwitterInfo(userId, limit, xCsrfToken, mode)

            if (outputInfo === "username") {
                followers.forEach((user: UserResult) => {
                    try {
                        output.push(user.legacy.screen_name)
                    } catch (e) {
                        console.error("Error parsing user: ", user);
                    }
                })
            } else {
                output = followers
            }

            console.log(`Got ${followers.length} followers for user ${userId} - exporting to followers.json...`)
            fs.writeFileSync("followers.json", JSON.stringify(output, null, 4))
            break;
        case "verified":
            const verified = await getTwitterInfo(userId, limit, xCsrfToken, mode)
            if (outputInfo === "username") {
                verified.forEach((user: UserResult) => {
                    output.push(user.legacy.screen_name)
                })
            } else {
                output = verified
            }

            console.log(`Got ${verified.length} verified for user ${userId} - exporting to verified.json...`)
            fs.writeFileSync("verified.json", JSON.stringify(output, null, 4))
            break;
    }

    console.log("Done!")
}

main()