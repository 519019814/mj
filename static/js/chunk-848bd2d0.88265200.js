(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-848bd2d0"],{5563:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"search-detail-container"},[i("div",{staticClass:"d-carousel"},[i("div",{staticStyle:{"text-align":"right",position:"absolute",left:"5px",top:"5px","z-index":"10"}},[i("el-button",{attrs:{size:"mini"},on:{click:t.onBackHistory}},[t._v("返回")])],1),i("el-carousel",{attrs:{height:"202px","indicator-position":"none"}},t._l(t.wc.urls,(function(e){return i("el-carousel-item",{key:e},[i("el-image",{staticStyle:{width:"100%",height:"202px"},attrs:{src:e,"preview-src-list":t.wc.urls}})],1)})),1),i("div",{staticClass:"des"},[i("div",{staticClass:"icon-list"},[i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"人流量：2500",placement:"top"}},[i("i",{staticClass:"el-icon-view"})]),i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"气味值：30",placement:"top"}},[i("i",{staticClass:"el-icon-location-outline"})]),i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"坑位：10",placement:"top"}},[i("i",{staticClass:"el-icon-place"})])],1),i("el-descriptions",{attrs:{title:"概况",column:1}},[i("el-descriptions-item",{attrs:{label:"名称"}},[t._v(t._s(t.wc.title))]),i("el-descriptions-item",{attrs:{label:"电话"}},[t._v(t._s(t.wc.timestamp))]),i("el-descriptions-item",{attrs:{label:"地址"}},[t._v(t._s(t.wc.address))]),i("el-descriptions-item",{attrs:{label:"创建时间"}},[t._v(t._s(t.wc.display_time))]),i("el-descriptions-item",{attrs:{label:"监督电话"}},[t._v("13256482148")]),i("el-descriptions-item",{attrs:{label:"状态"}},[i("el-tag",{attrs:{size:"small"}},[t._v("开启")])],1),i("el-descriptions-item",{attrs:{label:"所长"}},[t._v(t._s(t.wc.wcLeader))]),i("el-descriptions-item",{attrs:{label:"介绍"}},[t._v(" 飘香厕所，从字面意思上就可以知道它是一种厕所，特别的是这种厕所不臭，而且里面还充盈着淡淡的香味，里面如厕环境会更加的舒适，是现在国内开始新型提倡的一种环保理念厕所！此厕所目前处于向全国推广阶段中，有望在全国流行，现已有部分地区安装，如南京的洪武北路公交站点附近就有一座飘香厕所，吸引了不少人气；南京红山动物园、镇江宝华山景区等厕所也开始全部逐渐转变成这种飘香厕所！ ")]),i("el-descriptions-item",{attrs:{label:"制度"}},[t._v(" 一、管理标准： 1、卫生纸无霉烂、变质，严格按核定的有偿服务标准收费。 2、职责到人，全日开放，方便群众，优质服务。 3、工具、物品要摆放整齐。 4、照明、供水、排污设施完好。如有损坏，要及时修复。 5、管理房只供管理人员居住使用，不得让外人留宿或作其它用途。做好安全防范工作。 二、卫生标准 1、全日保洁，多次冲洗，做到无臭味。 2、厕内持续“六面光”。做到无蛛网、无烟头、无纸屑、无杂物。 3、定期药物消杀，做到无蚊蝇。 4、公厕周围环境整洁，墙壁内外无乱写乱画乱贴。 5、厕内干净，便槽畅通。无污迹、无尿碱、无便垢。 ")])],1)],1)],1)])},a=[],c=(i("053b"),i("f188")),l={name:"Place",data:function(){return{wc:{},isBack:!0,tempRoute:{}}},beforeRouteEnter:function(t,e,i){i((function(t){e.name||(t.isBack=!1)}))},beforeRouteUpdate:function(t,e,i){var s=this;console.log("当前路由改变"),setTimeout((function(){s.update()}),0),i()},created:function(){this.update()},methods:{update:function(){var t=this,e=this.$route.params.place;Object(c["a"])({id:e}).then((function(e){t.wc=e.data,t.$store.commit("searchWc/SET_SEARCHINPUT",t.wc.title),t.$store.commit("searchWc/SET_CURRENTWCINFO",t.wc)})).catch((function(t){console.log(t)}))},onBackHistory:function(){this.$store.commit("searchWc/SET_SEARCHINPUT",this.wc.title),this.$router.push({path:"/wcmap/page/search"})}}},o=l,n=(i("f40e"),i("cba8")),r=Object(n["a"])(o,s,a,!1,null,null,null);e["default"]=r.exports},d179:function(t,e,i){},f40e:function(t,e,i){"use strict";i("d179")}}]);