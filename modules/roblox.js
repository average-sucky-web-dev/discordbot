const axios = require('axios');
const { robloxKey } = require('./../config.json')
const domain = 'https://apis.roblox.com/cloud'

async function sendRequestAuthenticated(method, url, postData, headers) {
    if (headers) {
        return await axios.request(
            {
                'url': url,
                'method': method,
                'baseURL': domain,
                'params': postData,
                'headers': Object.assign(headers, {'x-api-key': robloxKey})
            }
        )
    } else {
        return await axios.request(
            {
                'url': url,
                'method': method,
                'baseURL': domain,
                'params': postData,
                'headers': {'x-api-key': robloxKey}
            }
        )
    }
}

async function rankToRole(groupId, rank) {
    let roleid = undefined
    let nextpage = 'None'
    while (!roleid) {
        if (nextpage === 'None') {
            const roles = await sendRequestAuthenticated('GET', `/v2/groups/${groupId}/roles?maxPageSize=100`)
        } else if (!nextpage) {
            throw new Error("RankId not found")
        } else {
            const roles = await sendRequestAuthenticated('GET' `/v2/groups/${groupId}/roles?maxPageSize=100&nextPageToken=${nextpage}`)
        }
        for (const role of roles.data.groupRoles) {
            if (role.rank === rank) {
                roleid = role.id
            }
        }
        nextpage = roles.nextPageToken
    }
    return roleid
}

async function usernameToUserID(username) {
    const user = await axios.post('https://users.roblox.com/v1/usernames/users', {"usernames": [username], 'excludeBannedUsers': true})
    return user.data.id
}

async function userIDToUsername(userID) {
    const user = await sendRequestAuthenticated("GET", `/v2/users/${userID}`)
    return user.data.username
}

async function rankUserByRole(userId, groupId, roleId) {
    return await sendRequestAuthenticated("PATCH", `/v2/groups/${groupId}/memberships/${userId}`, {"role": `groups/${groupId}/roles/${roleId}`})
}

async function rankUserByRank(userId, groupId, rank) {
    const roleId = await rankToRole(groupId, rank)
    return await rankUserByRole(userId, groupId, roleId)
}