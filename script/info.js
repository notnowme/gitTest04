
// 스포티파이 api 키 값.
const ID = config.id;
const SRT = config.secret;

// api 키 값으로 스포티파이 토큰 가져오기.
const getToken = async() => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(ID + ':' + SRT)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
};

// 주제별 정보 가져오기.
const getGenres = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=ko_KR`, {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.categories.items;
};

// 인기 곡 정보 가져오기.
const getMost = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?locale=ko_KR`, {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.playlists.items[0].id;
};

// 리스트 id 값으로 곡 리스트 가져오기.
const getList = async (token, id) => {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${id}?locale=ko_KR`, {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data;
}

// 노래 id로 곡 정보 가져오기.
const getSong = async (token, id) => {
    const result = await fetch(`https://api.spotify.com/v1/tracks/${id}?locale=ko_KR`, {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data;
};

// 테마 추천곡 정보 가져오기.
const getPop = async(token, id) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${id}/playlists?locale=ko_KR`, {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data;
};

// 인기 50 가져오기.
const getPopular = async() => {
    const token = await getToken();
    const getID = await getMost(token);
    const rst = await getList(token, getID);

    return rst;
};

export default { getGenres, getList, getMost, getPop, getPopular, getSong, getToken };

