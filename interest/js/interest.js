// const userNo = getCookie('user_no');
// const BASE_URL = "https://port-0-mureo-server-jvpb2mloi62iyf.sel5.cloudtype.app";
const currentDate = new Date();
const interestSectionLabel = document.getElementsByClassName('label-text')[0];
const interestDateDiv = document.getElementsByClassName('interest-date')[0];
const interestTitleDiv = document.getElementsByClassName('interest-title')[0];
const interestDesDiv = document.getElementsByClassName('interest-des')[0];
const postsDiv = document.getElementsByClassName('posts')[0];

let selectedInterestId = 0;

setSelectedInterest();

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}

function getUserInfo() {
    axios.get(`${BASE_URL}/users/${userNo}`)
    .then(result => {
        const user = result.data[0];
        interestSectionLabel.innerHTML = `${user.user_name}의 관심사`;
        
    })
    .catch(err => {
        console.log(err);
    });
} 

function setSelectedInterest() {
    axios.get(`${BASE_URL}/interest/${userNo}`)
        .then(response => {
            const selectedInterest = response.data[0];
            selectedInterestId = selectedInterest.interest_no;
            interestDateDiv.innerHTML = selectedInterest.start_date + '~';
            interestTitleDiv.innerHTML = selectedInterest.interest_name;
            interestDesDiv.innerHTML = selectedInterest.reason;
        
            getInterestPosts();
        })
        .catch(err => {
            alert('서버가 응답하지 않습니다.');
            console.log(err);
        })
}

function getUsersInterest() {
    axios.get(`${BASE_URL}/interest/${userNo}`) // 서버에서 데이터 가져오는 API 엔드포인트를 사용하세요
    .then(function (response) {
        const interestList = document.querySelector('.interest-list');

        response.data.forEach(function (itemData) {

            const days = calculateDaysBetweenDates(new Date(itemData.start_date), currentDate);

            // interest-item 요소 생성
            const interestItem = document.createElement('div');
            interestItem.className = 'interest-item';

            // titles 요소 생성
            const titles = document.createElement('div');
            titles.className = 'titles';

            // color 요소 생성
            const color = document.createElement('div');
            color.className = 'color';

            // color 요소 스타일, 내용 설정
            color.style.backgroundColor = itemData.color;
            titles.appendChild(color);

            // title-label 요소 생성
            const titleLabel = document.createElement('div');
            titleLabel.className = 'title-label';
            titleLabel.textContent = itemData.interest_name;
            titles.appendChild(titleLabel);

            // post-count 요소 생성
            const postCount = document.createElement('div');
            postCount.className = 'post-count';
            postCount.textContent = `작성한 글 ${itemData.postCount}개`;

            // days-since 요소 생성
            const daysSince = document.createElement('div');
            daysSince.className = 'days-since';
            daysSince.textContent = `좋아한 지 ${days}일`;

            // terms 요소 생성
            const terms = document.createElement('div');
            terms.className = 'terms';
            terms.textContent = `${itemData.start_date} ~ ${itemData.end_date}` ;

            // 생성한 요소들을 interestItem에 추가
            interestItem.appendChild(titles);
            interestItem.appendChild(postCount);
            interestItem.appendChild(daysSince);
            interestItem.appendChild(terms);

            // interestItem을 interestList에 추가
            interestList.appendChild(interestItem);
        });
    })
    .catch(function (error) {
        console.log(error);
    });
}

function getInterestPosts() {
    axios.get(`${BASE_URL}/interest/post/${selectedInterestId}`)
        .then(response => {
            const postList = response.data.result;
            postList.forEach((post, index) => {
                const postItem = document.createElement('div');
                postItem.className = 'post-item';
                
                const postTitle = document.createElement('div');
                postTitle.className = 'post-title';
                postTitle.innerHTML = post.title;

                const postContent = document.createElement('div');
                postContent.className = 'post-content';
                postContent.innerHTML = post.content;

                postItem.appendChild(postTitle);
                postItem.appendChild(postContent);

                postsDiv.appendChild(postItem);
            });
        })
        .catch(error => {
            alert('서버가 응답하지 않습니다.');
            console.log(error);
        })
}

function calculateDaysBetweenDates(startDate, endDate) {
    const millisecondsInDay = 24 * 60 * 60 * 1000; // 1일의 밀리초
    const timeDifference = endDate - startDate;
    const daysDifference = Math.floor(timeDifference / millisecondsInDay);
    return daysDifference + 1;
  }
  
getUserInfo();
getUsersInterest();



console.log(userNo);







