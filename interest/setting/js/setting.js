const infoButtonList = [...document.getElementsByClassName('info-button')];
const infoDivList = [...document.getElementsByClassName('interest-info')];

const doneButtonList = [...document.getElementsByClassName('done-button')];
const modal = document.getElementById('done-interest-modal');
const closeModalBtn = document.getElementById('close-modal-button');

let deleteInterestNo = 0;

infoButtonList.forEach((element, index) => {
    element.onclick = () => {
        if (infoDivList[index]) {
            infoDivList[index].classList.toggle('view');
        }
    };
});

doneButtonList.forEach((element, index) => {
    element.onclick = () => {
        modal.style.display = 'block';
    };
});

closeModalBtn.onclick = () => {
    modal.style.display = 'none';
    stopLiking(deleteInterestNo);
}

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

function getUsersInterests() {

    axios.get(`${BASE_URL}/interest/${userNo}`)
        .then(function (response) {
            const data = response.data;
            const interests = document.querySelector('.interests');

            data.forEach((item, index) => {
                const days = calculateDaysBetweenDates(new Date(item.start_date), currentDate);

                const interestHead = document.createElement('div');
                interestHead.className = 'interest-head';

                const interestContainer = document.createElement('div');
                interestContainer.className = 'interest-container';

                const interestTitle = document.createElement('div');
                interestTitle.className = 'interest-title';
                interestTitle.innerHTML = `
                  <div class="color" style="background-color: ${item.color};"></div>
                    <div class="title-label">${item.interest_name}</div>
                `;

                const interestSettings = document.createElement('div');
                interestSettings.className = 'interest-settings';

                const doneButton = document.createElement('button');
                doneButton.className = 'done-button';
                doneButton.textContent = '그만 좋아하기';

                const editButton = document.createElement('button');
                editButton.className = 'edit-button';
                editButton.textContent = '수정';

                const infoButton = document.createElement('button');
                infoButton.className = 'info-button';

                const iconifyIcon = document.createElement('iconify-icon');
                iconifyIcon.setAttribute('icon', 'ph:info');


                if (item.end_date !== "") {
                    interestContainer.style.backgroundColor = '#F4F4F4';
                    interestContainer.style.borderColor = '#fff';
                    doneButton.style.display = 'none';
                    editButton.style.display = 'none';
                    infoButton.style.backgroundColor = '#F4F4F4';
                }

                infoButton.appendChild(iconifyIcon);

                interestSettings.appendChild(doneButton);
                interestSettings.appendChild(editButton);
                interestSettings.appendChild(infoButton);

                const interestInfo = document.createElement('div');
                interestInfo.className = 'interest-info';
                interestInfo.innerHTML = `
                    <div class="post-count">작성한 글 0개</div>
                    <div class="days-since">좋아한 지 ${days}일</div>
                    <div class="terms">${item.start_date} ~ ${item.end_date}</div>
                `;

                interestHead.appendChild(interestTitle);
                interestHead.appendChild(interestSettings)
                interestContainer.appendChild(interestHead);
                interestContainer.appendChild(interestInfo);

                interests.appendChild(interestContainer);

                doneButton.onclick = () => {
                    deleteInterestNo = item.interest_no;
                    modal.style.display = 'block';
                }

                infoButton.onclick = () => {
                    if (interestInfo) {
                        interestInfo.classList.toggle('view');
                    }
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        });

}

function findParentSiblingInterestInfo(element) {
    const parentElement = element.parentElement;
    let sibling = parentElement.nextElementSibling;
    while (sibling) {
        if (sibling.classList.contains('interest-info')) {
            return sibling;
        }
        sibling = sibling.nextElementSibling;
        console.log(sibling);
    }
    return null; // "interest-info"를 찾지 못한 경우
}

function calculateDaysBetweenDates(startDate, endDate) {
    const millisecondsInDay = 24 * 60 * 60 * 1000; // 1일의 밀리초
    const timeDifference = endDate - startDate;
    const daysDifference = Math.floor(timeDifference / millisecondsInDay);
    return daysDifference + 1;
}

function stopLiking(interestNo) {
    const request = {
        "end_date": getCurrentDate()
    };

    console.log(interestNo, request);

    axios.patch(`${BASE_URL}/stop/${interestNo}`, request)
        .then(response => {
            console.log('result', response.data.result);
        })
        .catch(error => {
            console.log(error);
        });
}

getUsersInterests();