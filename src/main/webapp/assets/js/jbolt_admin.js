/**
 * 切换侧边Menu效果
 */
function toggleSliderMenu(){
	$(".myname").toggle();
	var has=$("body").hasClass("j_collapse_slider_menu");
	if(has){
		$("body").toggleClass("j_collapse_slider_menu");
		$(".j_slider_menus").slideDown();
	}else{
		$(".j_slider_menus").hide();
		$("body").toggleClass("j_collapse_slider_menu");
	}
}
/**
 * 切换侧边Menu效果
 */
function showSliderMenu(){
	var has=$("body").hasClass("j_collapse_slider_menu");
	if(has){
		$("body").removeClass("j_collapse_slider_menu");
		$(".j_slider_menus").slideDown();
	}
}
/**
 * 根据选中的模块切换显示的slider menu
 * @param {Object} moudelKey
 */
function changeMoudleSliderMenu(moudelKey){
	$(".j_slider_menus dl").hide().addClass("collapse").find("i:last-child").removeClass("fa-angle-down").addClass("fa-angle-right");
	var menus=$(".j_slider_menus dl[data-moudlekey='"+moudelKey+"']");
	var first=menus.first();
	first.find("dt").click();
	menus.slideDown();
}
function changeMoudle(moudle){
	if(moudle&&moudle.length>0){
		$(".j_moudles li.active").removeClass("active");
	 	moudle.addClass("active");
	 	showSliderMenu();
	 	changeMoudleSliderMenu(moudle.data("moudlekey"));
	 	
	}
}
//总布局tab 在每个主框架界面初始化
var JBoltTab=null;
//在主窗口区域打开新tab
function jboltOpenNewTab(options){
	var JBoltTab=$("#jtabs");
	JBoltTab.openNewTab(options);
}
//在主窗口关闭当前tab
function jboltCloseCurrentTab(){
	var JBoltTab=$("#jtabs");
	var tabId=JBoltTab.getCurrentTabId();
	JBoltTab.closeTabById(tabId);
}
//在主窗口关闭指定tab
function jboltCloseTabByTabId(tabId){
	JBoltTab.closeTabById(tabId);
}
//得到当前
function jboltGetCurrentTabId(options){
	var JBoltTab=$("#jtabs");
	return JBoltTab.getCurrentTabId();
}
$(function(){
	//绑定打开tab的触发对象事件
	 $(".j_slider_menus dl>dd").on("click",function(){
	 	$(".j_slider_menus dl>dd.active").removeClass("active");
	 	var btn=$(this);
	 	btn.addClass("active");
	 	var id=btn.data("id");
	 	var title=btn.text();
	 	var url=btn.data("url");
	 	JBoltTab.openNewTab({
	 		id:id,
	 		title:title,
	 		url:url,
	 		active:true
	 	});
	 });
	 
	 //绑定打开tab的触发对象事件
	 $("[data-tabtrigger]").on("click",function(e){
	 	e.stopPropagation();
		e.preventDefault();
	 	var btn=$(this);
	 	var id=btn.attr("id");
	 	if(!id){id=btn.data("id");}
	 	if(!id){id=randomId();btn.data("id",id);}
	 	var title=btn.text();
	 	var url=btn.attr("href");
	 	if(!url){
	 		url=btn.data("url");
	 	}
	 	JBoltTab.openNewTab({
	 		id:id,
	 		title:title,
	 		url:url,
	 		active:true
	 	});
	 });
	 
	  //点击header上的模块 切换自身样式和左侧菜单数据显示
	 $(".j_moudles li").on("click",function(){
	 	changeMoudle($(this));
	 });
	 //点击左侧菜单标题显示/收缩
	 $(".j_slider_menus dl>dt").on("click",function(){
	 	var dl=$(this).parent();
	 	var dli=$('.j_slider_menus dl[data-moudlekey="'+dl.data("moudlekey")+'"][data-menukey!="'+dl.data("menukey")+'"]').find("i:last-child");
	 	//dli.removeClass("fa-angle-down").addClass("fa-angle-right");
	 	//('.j_slider_menus dl').addClass("collapse");
	 	dl.toggleClass("collapse");
	 	var has=dl.hasClass("collapse");
	 	if(has){
	 		dl.find("i:last-child").removeClass("fa-angle-down").addClass("fa-angle-right");
	 	}else{
	 		dl.find("i:last-child").removeClass("fa-angle-right").addClass("fa-angle-down");
	 	}
	 	
	 });
	 //默认上来读取默认选中的模块 显示菜单
	 changeMoudle($(".j_moudles li.active"));
	 //左侧导航滚动条
	 //$(".j_slider_menu").niceScroll({ cursorcolor:"#999"});
	 
});