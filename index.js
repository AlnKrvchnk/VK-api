// import VK from 'vk-openapi';
// const parser = new RSSParser();
// https://oauth.vk.com/authorize?client_id=51650064&redirect_uri=https://vk.com/dev/api_requests&scope=offline&response_type=token&scope=friends
// https://api.vk.com/blank.html#access_token=vk1.a.5odbx2OZ02qtCE-3p2F23JdqkzvYPMlUxQYW3q-Q30BFaJyYvmL8aPv-qm1orussRobgYi2IGcBGAkObmiM6AMujpgDOIrR5wvQH3UcgHqfw2QgPBAWh0hzGphbvfKP2iFOy2kl73UCMCun3DHI799C8nm5V6BdhV6Imo4OcK5Nuv2XTrfS0HJK2zJQk72NYhiXrVMKxKSdEsnGrktiPOg&expires_in=0&user_id=181039632
import axios from 'axios';
// prettier-ignore
const token ='access_token=vk1.a.PB8sdhJzr2G5_ucsYFk0rKp5p-p7GwXgbkd4jSFmNCDTjyQc-VgSzMq_R2l0ilvnlNsQWLpuyEKPOAUdOHV7aimLabR1CfNUg7OCxwG8aaZK0eixmi1CsKtybD_JQP8TgTWbEZy55I2AapKT3gHntVTW6PfB2jiZRT16BxnRapDkRJiI6uykyuz_xIqYIYdp';
const v = 'v=5.131';
const url = 'https://api.vk.com/method/';
const method = 'friends.getMutual';

const all = `https://api.vk.com/method/friends.get?${token}&v=5.131&fields=nickname`;
const my_id = 181039632;

const getMutualFriends = async (source_id, target_id) => {
    const req = `${url}friends.getMutual?${
        target_id && `&target_uid=${target_id}`
    }${source_id && `&source_uid=${source_id}`}&${token}&${v}&execute`;

    try {
        return await axios.get(req);
    } catch (error) {
        console.error(error);
    }
};
const getMyFriends = async () => {
    const req = `https://api.vk.com/method/friends.get?${token}&v=5.131`;
    try {
        return await axios.get(req);
    } catch (error) {
        console.error(error);
    }
};
const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function getL(source_id, target_id) {
    let level = 0;
    let count = 1;
    let queue = [];
    let parent = [];
    queue.push(source_id);
    while (queue.length > 0) {
        try {
            const data = await getMutualFriends(my_id, queue[0]);
            console.log(data);
            let data_list = data.data.response ? data.data.response : [];

            if (data_list.includes(target_id)) {
                console.log(data_list.includes(target_id));
                return level;
            }
            parent.push(queue[0]);
            queue.shift();
            const mutual_friends = [...new Set(data_list)].filter(
                (item) => !parent.includes(item) && !queue.includes(item)
            );
            queue.push(...mutual_friends);

            --count;
            if (count === 0) {
                level++;
                count = queue.length;
            }
        } catch (err) {
            console.log(err.response);
        }
    }
    return level;
}

async function getMutualFriends_count(source_id, i) {
    try {
        const data = await getMutualFriends(my_id, source_id);
        const friend_list = data.data.response;
        return friend_list.length;
    } catch (err) {
        console.log(err);
    }
}
const getC_allFriend = async () => {
    const total_friend_count = 1126;
    const friend_count_list = [];
    const data = await getMyFriends();
    const my_friends = data.data.response.items;
    const N = my_friends.length;

    for (let i = 0; i < N; i++) {
        const source_id = my_friends[i];
        const friend_count = await getMutualFriends_count(source_id);
        await sleep(200);
        friend_count_list.push(friend_count);
    }
    console.log('friend_count_list: ' + friend_count_list);
    const friend_count_sum = friend_count_list.reduce((a, b) => a + b);
    const friend_count_srednee = friend_count_sum / N;
    console.log('friend_count_srednee: ' + friend_count_srednee);
    const contact_count = (N * (N - 1)) / 2;
    console.log('contact_count: ' + contact_count);
    const c_sum = friend_count_list.reduce((sum, item) => {
        const K = total_friend_count - item;
        const M = contact_count - item;
        const c = K / M;
        return sum + c;
    });
    console.log('c_sum: ' + c_sum);
    const C = c_sum / N;
    return C;
};

const getL_allFriend = async () => {
    const L = [];
    const data = await getMyFriends();
    const my_friends = data.data.response.items;
    const my_friend_copy = [...my_friends];

    const N = my_friends.length;
    for (let i = 0; i < N; i++) {
        my_friend_copy.shift();
        const source_id = my_friends[i];
        for (let i = 0; i < my_friend_copy.length; i++) {
            const target_id = my_friend_copy[i];
            const l = await getL(source_id, target_id);
            console.log(l);
            await sleep(300);

            L.push(l);
        }
    }
    console.log('L_array: ' + L);
    const l_srednee = L.reduce((a, b) => a + b) / ((N * (N - 1)) / 2);
    const max = Math.max(...L);
    console.log('L_srednee: ' + l_srednee);
    console.log('L_max: ' + max);
    return l_srednee;
};
// console.log('C= ' + (await getC_allFriend()));
console.log('L= ' + (await getL_allFriend()));
