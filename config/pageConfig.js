let myurl = 'https://www.hullchina.com'
let PAGE_CONFIG = {
defaultUserLogo: '/images/default-icon.png', // 用户默认头像
download: myurl,
ajaxBase: myurl+'/kk/',
searchURL: myurl+'/kk/json_content_list.php?kw=',
newslist: myurl+'/kk/json_content_list.php',
askslist: myurl+'/kk/json_diy_list.php?action=list',
answerurl: myurl+'/kk/json_diy_list.php?action=post',
banner: myurl+'/kk/json_banner_list.php',
circle: myurl+'/kk/json_banner_list.php?id=1',
subject: myurl+'/kk/json_view.php?aid=',
catalog: myurl+'/kk/json_type.php',
ranklist: myurl+'/kk/json_member.php',
click: myurl+'/kk/json_click.php?id=',
mainpic: myurl +'/images/wx-question.jpg',
cansocial:'false',
appname: "赫尔101"

}
module.exports = PAGE_CONFIG