const el = (selector) => document.querySelector(selector);

// 元素
const elUserMenu = el(`.user__menu`);
const elMainAside = el(`.main__aside`);
const elFormNewChatButton = el(`.aside__new-chat-button`);
const elAsideList = el(`.aside__list`);
const elMainArticle = el(`.main__article`);
const elQuestionTextarea = el(`.question__textarea`);

// 事件处理
const onKeyupQuestionTextarea = (event) => {
  const { key, shiftKey } = event;
  if (!(key === "Enter" && !shiftKey)) {
    return;
  }
  currentChatHistoryList.push({ role: 1, content: elQuestionTextarea.value });
  renderCurrentChatHistoryList([
    { role: 1, content: elQuestionTextarea.value },
  ]);
  elQuestionTextarea.value = "";
  elMainArticle.scrollTop = elMainArticle.scrollHeight;
  setTimeout(() => {
    currentChatHistoryList.push({
      role: 2,
      content: "抱歉我没有理解您的问题。",
    });
    renderCurrentChatHistoryList([
      { role: 2, content: "抱歉我没有理解您的问题。" },
    ]);
    const top = 99999;
    elMainArticle.scrollBy({ top });
  }, 1000);
};

// 监听器
window.addEventListener("resize", () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});
elUserMenu.addEventListener("click", () => {
  if ([...elMainAside.classList].includes("visible")) {
    elMainAside.classList.remove("visible");
  } else {
    elMainAside.classList.add("visible");
  }
});
elFormNewChatButton.addEventListener("click", () => {
  elMainArticle.innerHTML = "";
  elQuestionTextarea.focus();
});
elAsideList.addEventListener("click", async (event) => {
  const {
    target: { className },
    target,
  } = event;
  if (!["list-item", "list-item__text"].includes(className)) {
    return;
  }
  const elListItemList = elAsideList.children;
  for (const elListItem of elListItemList) {
    elListItem.classList.remove("active");
  }
  const currentElListItem = className.includes("list-item__text")
    ? target.parentNode
    : target;
  currentElListItem.classList.add("active");
  elMainArticle.innerHTML = "";
  await fetchChatHistoryList().catch((error) => {
    throw error;
  });
});
elQuestionTextarea.addEventListener("keyup", onKeyupQuestionTextarea);

// 数据
let currentTitleHistoryList = [];
let currentChatHistoryList = [];

// 模拟接口定义
const fetchTitleHistoryList = async () => {
  const { data } = await fetch("public/fetch-title-history-list.json")
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
  currentTitleHistoryList = Array.isArray(data) ? data : [];
  renderCurrentTitleHistoryList();
};
const fetchChatHistoryList = async () => {
  const { data } = await fetch(
    `public/fetch-chat-history-list-${randomNumber(3)}.json`
  )
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
  currentChatHistoryList = Array.isArray(data) ? data : [];
  renderCurrentChatHistoryList(currentChatHistoryList);
};

// 数据处理方法
const randomNumber = (num) => {
  return Math.floor(Math.random() * num);
};
// 创建函数来递归生成 HTML 结构
const createTreeNode = (node) => {
  const element = document.createElement(node.tag);
  if (node.classList) {
    for (const className of node.classList) {
      element.classList.add(className);
    }
  }
  if (node.text) {
    if (!node.text.includes("```")) {
      element.textContent = node.text;
    }
    const regex = /(```)([\s\S]+?)(```)/g;
    const replacement = `<pre class="content__code"><code>$2</code></pre>`;
    element.innerHTML = node.text.replace(regex, replacement);
  }
  if (node.children) {
    for (const childNode of node.children) {
      const childElement = createTreeNode(childNode);
      element.appendChild(childElement);
    }
  }
  return element;
};

// 渲染方法
const renderCurrentTitleHistoryList = () => {
  const treeData =
    currentTitleHistoryList.map((currentTitleHistoryItem) => {
      const { content } = currentTitleHistoryItem;
      const titleValue = {
        tag: "li",
        classList: ["list-item"],
        children: [
          { tag: "p", classList: ["list-item__text"], text: content },
          {
            tag: "div",
            classList: ["list-item__button-wrapper"],
            children: [
              { tag: "div", classList: ["button-wrapper__download"] },
              {
                tag: "div",
                classList: ["button-wrapper__delete"],
              },
            ],
          },
        ],
      };
      return titleValue;
    }) || [];
  for (const node of treeData) {
    const element = createTreeNode(node);
    elAsideList.appendChild(element);
  }
};
const renderCurrentChatHistoryList = (chatHistoryList) => {
  const treeData =
    chatHistoryList.map((chatHistoryItem) => {
      const { role, content } = chatHistoryItem;
      const userValue = {
        tag: "section",
        classList: ["article__section", "user"],
        children: [
          {
            tag: "div",
            classList: ["section__content-wrapper"],
            children: [
              { tag: "div", classList: ["content-wrapper__profile"] },
              {
                tag: "div",
                classList: ["content-wrapper__content"],
                text: content,
              },
            ],
          },
        ],
      };
      const chatValue = {
        tag: "section",
        classList: ["article__section"],
        children: [
          {
            tag: "div",
            classList: ["section__content-wrapper"],
            children: [
              { tag: "div", classList: ["content-wrapper__profile"] },
              {
                tag: "div",
                classList: ["content-wrapper__content"],
                text: content,
              },
            ],
          },
        ],
      };
      const hashMap = new Map().set(1, userValue).set(2, chatValue);
      return hashMap.get(role);
    }) || [];

  for (const node of treeData) {
    const element = createTreeNode(node);
    elMainArticle.appendChild(element);
  }
};

// 主函数
const main = async () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  await fetchTitleHistoryList().catch((error) => {
    throw error;
  });
  await fetchChatHistoryList().catch((error) => {
    throw error;
  });
};

main();
