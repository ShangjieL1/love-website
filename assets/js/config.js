/* ============================================================
 *  站点技术配置 —— 一般不用动
 *  留言板数据同步方式：
 *   - 云端留言存在本 GitHub 仓库的 data/messages.json 里
 *   - 读：走 jsdelivr CDN / raw（任何人可读，无需登录）
 *   - 写：需要"留言密钥"（GitHub 细粒度令牌，只授予本仓库，
 *         在 admin.html 里生成方法有说明；密钥只保存在浏览器本地）
 * ============================================================ */
window.SITE_CONFIG = {
  repo: {
    owner: "ShangjieL1",
    name:  "love-website",
    branch: "main"
  },
  messages: {
    githubPath: "data/messages.json",
    /* 若以后换用 jsonblob 等免密钥云存储，把地址填到这里即可 */
    jsonblobUrl: "",
    kvdbUrl: ""
  }
};
