import SPOTIFY from './info.js';

var swiper2 = new Swiper(".top-rank", {
    slidesPerView: 1,
    spaceBetween: 100,
    loop: true,
    pagination: {
        el: ".swiper2-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper2-button-next",
        prevEl: ".swiper2-button-prev",
    },
});

// 인기 50 그리기.
const rederPopular = async() => {
    // 그릴 곳의 위치.
    const RENDER = $('.sec-recmd');

    // 데이터 가져오기.
    const arr = await SPOTIFY.getPopular();

    // 넣을 곳.
    const els = [];

    let index = 0;
    for(let i=0; i < 50; i++) {
        if(index >= 50) {
            break;
        }
        let count = 0;
        let element = `
                <div class="swiper-slide">
                <div class="side-board">
                <div class="top-board">
        `
        element += `<ul class="board l-board">`
        while(count < 5) {
            element += `
                <li>
                <div class="album-box"><img src="${arr.tracks.items[index].track.album.images[0].url}"></div>
                <p class="board-num">${index+1}</p>
                <ul class="info">
                <li><span class="song-name"><a href="https://open.spotify.com/track/${arr.tracks.items[index].track.id}" target="_blank">${arr.tracks.items[index].track.name}</a></span></li>
                <li><span class="singer-name">${arr.tracks.items[index].track.artists[0].name}</span></li>
                </ul>
                </li>
            `
            index++;
            count++;
        }
        count = 0;
        element += `</ul><ul class="board r-board">`
        while(count < 5) {
            element += `
                <li>
                <div class="album-box"><img src="${arr.tracks.items[index].track.album.images[0].url}"></div>
                <p class="board-num">${index+1}</p>
                <ul class="info">
                <li><span class="song-name"><a href="https://open.spotify.com/track/${arr.tracks.items[index].track.id}" target="_blank">${arr.tracks.items[index].track.name}</a></span></li>
                <li><span class="singer-name">${arr.tracks.items[index].track.artists[0].name}</span></li>
                </ul>
                </li>
            `
            index++;
            count++;
        }
        els.push(element);
    }
    swiper2.appendSlide(els);
    swiper2.update();
};
rederPopular();

// 장르 추천 그리기.
var swiper3 = new Swiper(".card-slider", {
    slidesPerView: 2,
    spaceBetween: 150,
    loop: true,
    loopAdditionalSlides: 1,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper3-pagination",
        clickable: true,
        dynamicBullets: true
    },
    breakpoints: {
        600: {
            slidesPerView: 2,
            spaceBetween: 60,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 180,
        },
        1000: {
            slidesPerView: 4,
            spaceBetween: 180,
        },
        1150: {
            slidesPerView: 4,
            spaceBetween: 60,
        },
        1280: {
            slidesPerView: 5,  //브라우저가 768보다 클 때
            spaceBetween: 180,
        },
        1400: {
            slidesPerView: 5,
            spaceBetween: 60,
        },
    },
});

$('.card-btn').on('click',(e)=>{
    const item = e.target.innerText;
    renderRecmd(item);
})
const renderRecmd = async(genre = '여름') => {
    let modal = false;
    const token = await SPOTIFY.getToken();
    const data = await SPOTIFY.getGenres(token);

    const rst = data.filter(el => el.name === genre)

    const playLists = await SPOTIFY.getPop(token, rst[0].id);

    const BOARD = $('#sec3');
    BOARD.html('');
    let els = []
    playLists.playlists.items.forEach(el => {
        let element = `
            <div class="swiper-slide">
                <div class="card" value="${el.id}">
                <div class="album-pic">
                    <img src="${el.images[0].url}" />
                </div>
                <ul class="album-info">
                    <li><span class="album-tit">${el.name}</span></li>
                    <li><span class="album-singer"></span></li>
                </ul>
                </div>
            </div>
        `
        els.push(element);
    });
    swiper3.appendSlide(els);
    swiper3.update();
    document.querySelectorAll('.card').forEach(el => {
        el.addEventListener('click',async()=>{
            const playId = el.getAttribute('value');
            const result = await SPOTIFY.getList(token, playId);
            modal = true;
            renderModal(result, modal);
        })
    })
};

renderRecmd();

function renderModal(result, modal) {
    let content = `
        <div class="modal-content">
            <div id="modal-close"><i class="icon-cancel"></i></div>
            <div class="modal-top">
                <div class="modal-img">
                    <img src="${result.images[0].url}" />
                </div>
                <div class="modal-info">
                    <p>플레이 리스트</p>
                    <h1>${result.name}</h1>
                </div>
            </div>
            <div class="modal-bottom">
                <div class="modal-bottom-top">
                    <ul>
                        <li>#</li>
                        <li>제목</li>
                    </ul>
                </div>
            </div>
    `
    result.tracks.items.forEach((el, index) => {
        content += `
        <div class="modal-song">
            <ul>
                <li>${index+1}</>
                <li class="modal-detail">
                    <div class="modal-inimg">
                        <img src="${el.track.album.images[0].url}" />
                    </div>
                    <div class="modal-text">
                        <span><a href="${el.track.external_urls.spotify}" target="_blank">${el.track.name}</a></span>
                        <span>${el.track.artists[0].name}</span>
                    </div>
                </li>
            </ul>
        </div>
        `;
    });
    content += `</div>`;

    if(modal) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        $('body').append(modal);
        modal.innerHTML = content
    }
    document.querySelector('#modal-close').addEventListener('click',()=>{
        $('.modal').remove();
        modal = false;
    })
}
