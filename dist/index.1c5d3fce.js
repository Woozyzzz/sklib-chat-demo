const t=t=>document.querySelector(t),e=t(".user__menu"),s=t(".main__aside"),i=t(".form__new-chat-button"),n=t(".aside__list"),c=t(".main__article"),a=t(".question__textarea"),l=t(".question__submit-button");window.addEventListener("resize",()=>{let t=.01*window.innerHeight;document.documentElement.style.setProperty("--vh",`${t}px`)}),e.addEventListener("click",()=>{[...s.classList].includes("visible")?s.classList.remove("visible"):s.classList.add("visible")}),i.addEventListener("click",()=>{c.innerHTML="",a.focus()}),n.addEventListener("click",async t=>{let{target:{className:e}}=t;"list-item"===e&&(c.innerHTML="",await h().catch(t=>{throw t}))}),c.addEventListener("click",t=>{let{target:{className:e},target:s}=t;e.includes("content__more-button")&&(e.includes("expanded")?(s.innerHTML="展开更多",s.classList.remove("expanded"),s.previousSibling.classList.remove("expanded")):(s.innerHTML="收起更多",s.classList.add("expanded"),s.previousSibling.classList.add("expanded")))}),l.addEventListener("click",()=>{r.push({role:1,content:a.value}),p([{role:1,content:a.value}]),a.value="",c.scrollTop=c.scrollHeight,setTimeout(()=>{r.push({role:2,content:"抱歉我没有理解您的问题。"}),p([{role:2,content:"抱歉我没有理解您的问题。"}])},1e3)});let o=[],r=[];const d=async()=>{let{data:t}=await fetch("public/fetch-title-history-list.json").then(t=>t.json()).catch(t=>{throw t});o=Array.isArray(t)?t:[],L()},h=async()=>{let{data:t}=await fetch(`public/fetch-chat-history-list-${_(3)}.json`).then(t=>t.json()).catch(t=>{throw t});p(r=Array.isArray(t)?t:[])},_=t=>Math.floor(Math.random()*t),u=t=>{let e=document.createElement(t.tag);if(t.classList)for(let s of t.classList)e.classList.add(s);if(t.text&&(e.textContent=t.text),t.children)for(let s of t.children){let t=u(s);e.appendChild(t)}return e},L=()=>{let t=o.map(t=>{let{content:e}=t;return{tag:"li",classList:["list-item"],text:e}})||[];for(let e of t){let t=u(e);n.appendChild(t)}},p=t=>{let e=t.map(t=>{let{role:e,content:s}=t,i=s.length>500?{tag:"section",classList:["article__section"],children:[{tag:"div",classList:["section__profile"]},{tag:"div",classList:["section__content"],children:[{tag:"div",classList:["content__text","more"],text:s},{tag:"span",classList:["content__more-button"],text:"展开更多"}]}]}:{tag:"section",classList:["article__section"],children:[{tag:"div",classList:["section__profile"]},{tag:"div",classList:["section__content"],children:[{tag:"div",classList:["content__text"],text:s}]}]},n=new Map().set(1,{tag:"section",classList:["article__section","user"],children:[{tag:"div",classList:["section__profile"]},{tag:"div",classList:["section__content"],text:s}]}).set(2,i);return n.get(e)})||[];for(let t of e){let e=u(t);c.appendChild(e)}},v=async()=>{let t=.01*window.innerHeight;document.documentElement.style.setProperty("--vh",`${t}px`),await d().catch(t=>{throw t}),await h().catch(t=>{throw t})};v();
//# sourceMappingURL=index.1c5d3fce.js.map
