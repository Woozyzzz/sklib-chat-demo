const el = (selector) => document.querySelector(selector);

// 元素
const elUserMenu = el(`.user__menu`);
const elMainAside = el(`.main__aside`);
const elFormNewChatButton = el(`.form__new-chat-button`);
const elAsideList = el(`.aside__list`);
const elMainArticle = el(`.main__article`);
const elQuestionTextarea = el(`.question__textarea`);
const elQuestionSubmitButton = el(`.question__submit-button`);

// 事件处理
const onClickQuestionSubmitButton = () => {
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
  }, 1000);
};

// 监听器
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
  } = event;
  if (className !== "list-item") {
    return;
  }
  elMainArticle.innerHTML = "";
  await fetchChatHistoryList().catch((error) => {
    throw error;
  });
});
elMainArticle.addEventListener("click", (event) => {
  const {
    target: { className },
    target,
  } = event;
  if (!className.includes("content__more-button")) {
    return;
  }
  if (className.includes("expanded")) {
    target.innerHTML = "展开更多";
    target.classList.remove("expanded");
    target.previousSibling.classList.remove("expanded");
  } else {
    target.innerHTML = "收起更多";
    target.classList.add("expanded");
    target.previousSibling.classList.add("expanded");
  }
});
elQuestionSubmitButton.addEventListener("click", onClickQuestionSubmitButton);

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
    element.textContent = node.text;
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
        text: content,
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
          { tag: "div", classList: ["section__profile"] },
          {
            tag: "div",
            classList: ["section__content"],
            text: content,
          },
        ],
      };
      const thresholdContentLength = 500;
      const chatValue =
        content.length > thresholdContentLength
          ? {
              tag: "section",
              classList: ["article__section"],
              children: [
                { tag: "div", classList: ["section__profile"] },
                {
                  tag: "div",
                  classList: ["section__content"],
                  children: [
                    {
                      tag: "div",
                      classList: ["content__text", "more"],
                      text: content,
                    },
                    {
                      tag: "span",
                      classList: ["content__more-button"],
                      text: "展开更多",
                    },
                  ],
                },
              ],
            }
          : {
              tag: "section",
              classList: ["article__section"],
              children: [
                { tag: "div", classList: ["section__profile"] },
                {
                  tag: "div",
                  classList: ["section__content"],
                  children: [
                    {
                      tag: "div",
                      classList: ["content__text"],
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
  await fetchTitleHistoryList().catch((error) => {
    throw error;
  });
  await fetchChatHistoryList().catch((error) => {
    throw error;
  });
};

main();
