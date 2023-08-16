// 初始化 Sortable 只在非移动端进行
if (!isMobile) {
    new Sortable(articlesContainer, {
        animation: 150,
        handle: '.article',
        onEnd: function (event) {
            const [movedItem] = articlesData.splice(event.oldIndex, 1);
            articlesData.splice(event.newIndex, 0, movedItem);
            saveToLocalStorage();
        },
    });
    loadFromLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('articlesData', JSON.stringify(articlesData));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('articlesData');
    if (savedData) {
        const savedArticlesData = JSON.parse(savedData);
        articlesData.splice(0, articlesData.length, ...savedArticlesData);
        refreshArticleElements();
    }
}
// 刷新文章列表的显示
function refreshArticleElements() {
    const articleElements = document.querySelectorAll('.article');
    articleElements.forEach((articleElement, index) => {
        const titleElement = articleElement.querySelector('h2');
        const introElement = articleElement.querySelector('.intro');
        titleElement.textContent = articlesData[index].title;
        introElement.textContent = articlesData[index].intro;
    });
}
// 动态生成文章列表
articlesData.forEach((article, index) => {
    const articleElement = document.createElement('div');
    articleElement.classList.add('article');
    articleElement.innerHTML = `
        <h2>${article.title}</h2>
        <div class="article-content">
            <div class="intro">${article.intro}</div>
            <div class="content"></div>
        </div>
    `;
    articlesContainer.appendChild(articleElement);
    const articleContent = articleElement.querySelector('.article-content');
    articleElement.addEventListener('click', () => {
        toggleArticleContent(articleContent, article.contentFile);
    });
    articleElement.addEventListener('mouseover', () => {
        showArticleIntro(articleContent);
    });
    articleElement.addEventListener('mouseout', () => {
        hideArticleIntro(articleContent);
    });
});
// 切换文章内容的显示与隐藏
function toggleArticleContent(articleElement, contentFile) {
    const intro = articleElement.querySelector('.intro');
    const content = articleElement.querySelector('.content');
    intro.style.display = 'none';
	hideAllArticleIntro();
    if (content.style.display === 'block') {
        content.style.display = 'none';
    } else {
		loadArticleContent(content, contentFile);
        content.style.display = 'block';
    }
}
// 显示文章简介
function showArticleIntro(articleElement) {
    const intro = articleElement.querySelector('.intro');
    intro.style.display = 'block';
}
// 隐藏文章简介
function hideAllArticleIntro() {
    const articleElements = document.querySelectorAll('.article');
    articleElements.forEach(article => {
        const intro = article.querySelector('.intro');
        intro.style.display = 'none';
    });
}
// 隐藏所有文章的详细内容
function hideAllArticleContent() {
    const articleElements = document.querySelectorAll('.article');
    articleElements.forEach(article => {
        const intro = article.querySelector('.intro');
        const content = article.querySelector('.content');
        intro.style.display = 'block';
        content.style.display = 'none';
    });
}
// 加载文章内容
function loadArticleContent(contentElement, contentFile) {
    fetch(contentFile)
        .then(response => response.text())
        .then(content => {
            contentElement.innerHTML = content;
            contentElement.style.display = 'block';
        })
        .catch(error => {
            console.error('加载文章内容失败:', error);
            contentElement.style.display = 'none';
        });
}
// 切换网站地图内容的显示与隐藏
sitemapIcon.addEventListener('click', () => {
    if (sitemapContent.style.display === 'none') {
        sitemapContent.style.display = 'block';
    } else {
        sitemapContent.style.display = 'none';
    }
});
// 搜索功能
searchIcon.addEventListener('click', () => {
    if (searchInput.style.display === 'inline-block') {
        searchInput.style.display = 'none';
    } else {
        searchInput.style.display = 'inline-block';
        searchInput.focus();
    }
});
// 监听搜索输入框输入事件
searchInput.addEventListener('input', () => {
    const searchKeyword = searchInput.value.trim();
    const articlesContainer = document.getElementById('articles');
    articlesContainer.innerHTML = '';
    articlesData.forEach((article, index) => {
        if (article.title.includes(searchKeyword)) {
            const articleElement = document.createElement('div');
            articleElement.classList.add('article');
            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <div class="intro">${article.intro}</div>
                <div class="content"></div>
            `;
            articlesContainer.appendChild(articleElement);
            articleElement.addEventListener('click', () => {
                toggleArticleContent(articleElement, article.contentFile);
            });
            articleElement.addEventListener('mouseover', () => {
                showArticleIntro(articleElement);
            });
            articleElement.addEventListener('mouseout', () => {
                hideArticleIntro(articleElement);
            });
        }
    });
});
// 使用 IP 地址获取浏览者地理位置信息
async function getVisitorLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_name;
        const city = data.city;
        const locationElement = document.getElementById('visitor-location');
        locationElement.textContent = `欢迎来自${country}，${city}的陌生人`;
    } catch (error) {
        console.error('获取地理位置信息失败:', error);
    }
}
window.addEventListener('DOMContentLoaded', () => {
    getVisitorLocation();
});
// 获取或设置浏览次数
function getVisitCount() {
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount = parseInt(visitCount) + 1;
    localStorage.setItem('visitCount', visitCount);
    return visitCount;
}
window.addEventListener('DOMContentLoaded', () => {
    const visitCount = getVisitCount();
    const visitCountElement = document.getElementById('visit-count');
    visitCountElement.textContent = `这是您第 ${visitCount} 次访问本站!`;
});
// 显示或隐藏回到顶部链接
window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.querySelector('.back-to-top').style.display = 'block';
    } else {
        document.querySelector('.back-to-top').style.display = 'none';
    }
};
// 点击回到顶部链接时的滚动效果
document.querySelector('.back-to-top').addEventListener('click', function (event) {
    event.preventDefault();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	hideAllArticleIntro();
});
// 监听滚动事件
window.addEventListener('scroll', function () {
    // 获取所有文章元素
    const articleElements = document.querySelectorAll('.article');
    
    // 遍历文章元素，隐藏简介
    articleElements.forEach(articleElement => {
        const introElement = articleElement.querySelector('.intro');
        introElement.style.display = 'none';
    });
});
