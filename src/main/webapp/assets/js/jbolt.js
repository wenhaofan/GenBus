(function($) {
    $.fn.extend({
        toJsonObject : function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [ o[this.name] ];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        }
    });

})(jQuery)
var loading='<div  class="portalloading"><img style="width:60px;height:60px;" src="assets/img/ing.gif"/></div>';
/**
 * 得到内页高度
 * @returns
 */
function getInnerPageHeight(minusHeight) {
	if(minusHeight==0){
		return $(window).height();
	}else if(minusHeight>0){
		return $(window).height()-minusHeight;
	}else{
		return $(window).height()-40;
	}
    
}
/**
 * 判断数据再数据中的下标
 * @param {Object} tabs
 * @param {Object} tabId
 */
function tabIndexInTabsArray(tabs,tabId){
	for(var i in tabs){
		if(tabId===tabs[i].id){
			return parseInt(i);
		}
	}
	return -1;
}
/**
 * 删除数组指定下标元素
 * @param {Object} array
 * @param {Object} n
 */
function arrayDelByIndex(array,index) {
　	if(index<0){
		return array;
	}else{
		return array.slice(0,index).concat(array.slice(index+1,array.length));
	}
}
function showPortalLoading(parentId){
	var p=$("#"+parentId);
	var ploading=p.find(".portalloading");
	if(ploading&&ploading.length==0){
		p.append(loading);
		ploading=p.find(".portalloading");
	}
	ploading.show();
}
function hidePortalLoading(parentId){
	var p=$("#"+parentId);
	var ploading=p.find(".portalloading");
	if(ploading&&ploading.length==1){
		ploading.hide();
	}
	 
}
/**
 * 生成随机ID
 */
function randomId(){
	var ran=Math.random();
	ran=ran.toString().replace(".","");
	return new Date().getTime()+ran;
}
 

$.fn.size=function(){
	return this.length;
}

 
/**
 * 封装tab组件
 */
;(function($){
		$.extend($.fn, {
			mainTpl:'<div class="j_tabs_box noselect"><div class="j_tab_left" id="${leftId}"><i class="fa fa-angle-left" aria-hidden="true"></i></div><ul class="j_tabs j_animated" id="${ulId}"></ul><div class="j_tab_right"  id="${rightId}"><i class="fa fa-angle-right" aria-hidden="true"></i></div></div><div class="j_tab_iframes" id="${mainBoxId}"></div>',
			tabTpl:'<li id="${id}" data-lasttabid="${lastTabId}" data-url="${url}">${title}{@if !noClose}<i  class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></i>{@/if}</li>',
			iframeTpl:'<iframe id="${tabId}_iframe" name="iframe_${tabId}" src="${url}" style="width:100%;height:100%" frameborder="0" marginheight="0" marginwidth="0"></iframe>',
			options:{
				ulId:null,
				moving:false,
				mainBoxId:null,
				leftId:null,
				rightId:null,
				tabsUl:null,
				tabBox:null,
				moveIndex:0,
				mainIframeBox:null,
					tabs:[],
					allTabs:[],
				},
			//初始化tab
			jboltTab:function(tabOptions){
				//初始化组件
				this.options = $.extend(this.options, tabOptions);
				return this.each(function(){
					var tabContainer=$(this);
					tabContainer.options.ulId=randomId();
					tabContainer.options.leftId=randomId();
					tabContainer.options.rightId=randomId();
					tabContainer.options.mainBoxId=randomId();
					//先创建tab导航条主结构html 使用juicer模板
					var html=juicer(tabContainer.mainTpl,{
						ulId:tabContainer.options.ulId,
						leftId:tabContainer.options.leftId,
						rightId:tabContainer.options.rightId,
						mainBoxId:tabContainer.options.mainBoxId
					});
					tabContainer.append(html);
					tabContainer.options.tabBox=tabContainer.find(".j_tabs_box");
					tabContainer.options.tabsUl=$("#"+tabContainer.options.ulId);
					tabContainer.options.mainIframeBox=$("#"+tabContainer.options.mainBoxId);
					//循环初始化tab 有就打开
					var tabs=tabContainer.options.tabs;
					if(tabs&&tabs.length>0){
						//var max=tabContainer.options.max;
						//if(tabs.length>max){
						//	alert("默认最多可创建有效Tab"+max+"个");
						//	return false;
						//}
						for(var i in tabs){
							tabContainer.openNewTab(tabs[i]);
						}
					}
					//绑定事件处理
					tabContainer.processTabEvent();
				});
			},openNewTab:function(tabOptions){
				if(!tabOptions){
					return false;
				}
				var tabContainer=$(this);
				var tabId=tabOptions.id;
				if(!tabOptions.noClose){
					var lastTabId=tabContainer.getCurrentTabId();
					if(lastTabId){
						tabOptions.lastTabId=lastTabId;
					}
				}
				if(tabId){
					var existLi=tabContainer.find("#"+tabId);
					if(existLi&&existLi.length==1){
						existLi.data("lasttabid",tabOptions.lastTabId);
						if(existLi.hasClass("active")){
							tabContainer.activeTabById(tabId,true);
						}else{
							$(".j_tabs>li.active").removeClass("active");
						    existLi.addClass("active");
						    var mainIframeBox=tabContainer.options.mainIframeBox;
							//判断有没有iframe
							var iframe=mainIframeBox.find("#"+tabId+"_iframe");
							mainIframeBox.find("iframe").hide();
							if(iframe&&iframe.length==1){
								//如果已经有了 就显示
								iframe.show();
								
							}
							tabContainer.activeTabById(tabId);
						}
						/*if(tabOptions.reload){
							tabContainer.reloadById(tabId);
						}*/
						
						return tabId;
						
					}else{
						//把每个tab都存到数组中
						tabContainer.options.allTabs.push(tabOptions);
						//创建新的tab和iframe组件集合 添加到container中
						var html=juicer(tabContainer.tabTpl,tabOptions);
						tabContainer.options.tabsUl.append(html);
					}
					
				}else{
					//打开一个新tab
					tabOptions.id=randomId();
					//把每个tab都存到数组中
					tabContainer.options.allTabs.push(tabOptions);
					//创建新的tab和iframe组件集合 添加到container中
					var html=juicer(tabContainer.tabTpl,tabOptions);
					tabContainer.options.tabsUl.append(html);
				}
				
				
				//判断如果需要激活 就调用activeIt
				if(tabOptions.active){
					tabContainer.activeTabById(tabOptions.id);
					tabContainer.autoMoveToLeft();
				}
				return tabOptions.id;
			},autoMoveToLeft:function(){
					var tabContainer=$(this);
					tabContainer.moveToLeft(true);
				
			},activeTabById:function(tabId,needCheckActive){
				//通过tabId激活指定的tab
				var tabContainer=$(this);
				var tabLi=$("#"+tabId);
				tabContainer.activeTab(tabLi,needCheckActive);
			},activeTab:function(tab,needCheckActive){
				//激活指定的tab
				if(!tab||tab.length==0){
					return false;
				}
				var tabContainer=$(this);
				var tabId=tab.attr("id");
				
				
				if(tab.hasClass("active")){
					
					var mainIframeBox=tabContainer.options.mainIframeBox;
					//判断有没有iframe
					var iframe=mainIframeBox.find("#"+tabId+"_iframe");
					if(iframe.is(":hidden")){
						iframe.fadeIn();
					}
					if(!needCheckActive){
						var iframeWin = window[iframe[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method()
						iframeWin.processAutoReload();
					}
					
					return true;
				}
				
				var lastTabId=tabContainer.getCurrentTabId();
				$(".j_tabs>li.active").removeClass("active");
				tab.addClass("active");
				
				if(tabId){
					//激活前设置上一个
					if(lastTabId&&lastTabId!=tabId){
						tab.data("lasttabid",lastTabId);
					}
					
					var url=tab.data("url");
					if(!url){
						alert("tab的Url地址有误");
						return false;
					}
					var tabs=tabContainer.options.allTabs;
					var mainIframeBox=tabContainer.options.mainIframeBox;
					//判断有没有iframe
					var iframe=mainIframeBox.find("#"+tabId+"_iframe");
					mainIframeBox.find("iframe").hide();
					if(iframe&&iframe.length==1){
						//如果已经有了 就显示
						iframe.fadeIn();
						var iframeWin = window[iframe[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method()
						iframeWin.processAutoReload();
					}else{
						//没有才创建出来
						
						var html=juicer(tabContainer.iframeTpl,{tabId:tabId,url:url});
						mainIframeBox.append(html);
						var iframe=mainIframeBox.find("#"+tabId+"_iframe");
						iframe.on("load",function(){
							hidePortalLoading(tabContainer.options.mainBoxId);
						});
						iframe.fadeIn();
						showPortalLoading(tabContainer.options.mainBoxId);
						
					}
				}
			},reloadById:function(tabId){
				//重新加载 tab iframe
				var tabContainer=$(this);
				var tabs=tabContainer.options.allTabs;
				var index=tabIndexInTabsArray(tabs,tabId);
				if(index!=-1){
					var tabLi=$("#"+tabId);
					tabContainer.reloadTab(tabLi);
				}		
			},reloadTab:function(tab){
				if(!tab||tab.length==0){
					return false;
				}
				//激活指定的tab
				var tabContainer=$(this);
				var tabId=tab.attr("id");
				if(tabId){
					var url=tab.data("url");
					if(!url){
						alert("tab的Url地址有误");
						return false;
					}
					var mainIframeBox=tabContainer.options.mainIframeBox;
					//判断有没有iframe
					var iframe=mainIframeBox.find("#"+tabId+"_iframe");
					mainIframeBox.find("iframe").hide();
					if(iframe&&iframe.length==1){
						showPortalLoading(tabContainer.options.mainBoxId);
						//如果已经有了 就显示
						iframe.fadeIn();
						iframe.attr("src",url);
					}
				}
			},getCurrentTabId:function(){
				var tabContainer=$(this);
				var hasActive=tabContainer.find(".j_tabs_box li.active");
				if(hasActive&&hasActive.length==1){
					return hasActive.attr("id");
				}
				
				return undefined;
			},closeTabById:function(tabId){
				//删掉一个tab 根据tabID
				var tabContainer=$(this);
				var tabLi=$("#"+tabId);
				tabContainer.closeTab(tabLi);
			},closeLeftTabs:function(tab){
				//关闭右侧tab
				var tabContainer=$(this);
				var allTabs=tabContainer.options.allTabs;
				var size=allTabs.length;
				var tabId=tab.attr("id");
				
				if(size>0){
					//判断只有不是最后一个的时候才能删除右侧tab
					var index=tabIndexInTabsArray(tabContainer.options.allTabs,tabId);
					if(index>0){
						var start=0;
						var mainIframeBox=tabContainer.options.mainIframeBox;
						for(var i=start;i<index;i++){
							if(!(allTabs[i].noClose)){
								tabContainer.find("#"+allTabs[i].id).remove();
								mainIframeBox.find("#"+allTabs[i].id+"_iframe").remove();
								var delindex=tabIndexInTabsArray(tabContainer.options.allTabs,allTabs[i].id);
								tabContainer.options.allTabs=arrayDelByIndex(tabContainer.options.allTabs,delindex);
							}
						}
						var remainingCount=tabContainer.options.allTabs.length;
						if(remainingCount>0&&tab.hasClass("active")==false){
							//判断删除干净后如果还有已经active的 就什么都不干
							var hasActive=tabContainer.find(".j_tabs_box li.active");
							if(hasActive&&hasActive.length==1){
								//nothing
							}else{
									tabContainer.activeTabById(allTabs[0].id);
							}
							
						}
						//处理滚动位置
						var ul=tabContainer.options.tabsUl;
						ul.css("left",0);
						tabContainer.options.moveIndex=0;
						
					}
				}
			},closeRightTabs:function(tab){
				//关闭右侧tab
				var tabContainer=$(this);
				var allTabs=tabContainer.options.allTabs;
				var size=allTabs.length;
				var tabId=tab.attr("id");
				if(size>0){
					//判断只有不是最后一个的时候才能删除右侧tab
					var index=tabIndexInTabsArray(tabContainer.options.allTabs,tabId);
					if(index<size-1){
						var start=index+1;
						var mainIframeBox=tabContainer.options.mainIframeBox;
						for(var i=start;i<size;i++){
							if(!(allTabs[i].noClose)){
								tabContainer.find("#"+allTabs[i].id).remove();
								mainIframeBox.find("#"+allTabs[i].id+"_iframe").remove();
								var delindex=tabIndexInTabsArray(tabContainer.options.allTabs,allTabs[i].id);
								tabContainer.options.allTabs=arrayDelByIndex(tabContainer.options.allTabs,delindex);
							}
						}
						var remainingCount=tabContainer.options.allTabs.length;
						if(remainingCount>0&&tab.hasClass("active")==false){
							//判断删除干净后如果还有已经active的 就什么都不干
							var hasActive=tabContainer.find(".j_tabs_box li.active");
							if(hasActive&&hasActive.length==1){
								//nothing
							}else{
								tabContainer.activeTabById(allTabs[0].id);
							}
							
						}
						
					}
				}
			},closeOtherTabs:function(tab){
				//关闭其他tab
				var tabContainer=$(this);
				var allTabs=tabContainer.options.allTabs;
				var size=allTabs.length;
				var tabId=tab.attr("id");
				if(size>0){
					var mainIframeBox=tabContainer.options.mainIframeBox;
					for(var i in allTabs){
						if(!(allTabs[i].noClose)&&allTabs[i].id!=tabId){
							tabContainer.find("#"+allTabs[i].id).remove();
							mainIframeBox.find("#"+allTabs[i].id+"_iframe").remove();
							var index=tabIndexInTabsArray(tabContainer.options.allTabs,allTabs[i].id);
							tabContainer.options.allTabs=arrayDelByIndex(tabContainer.options.allTabs,index);
						}
					}
					var remainingCount=tabContainer.options.allTabs.length;
					if(remainingCount>0&&tab.hasClass("active")==false){
						//判断删除干净后如果还有已经active的 就什么都不干
						var hasActive=tabContainer.find(".j_tabs_box li.active");
						if(hasActive&&hasActive.length==1){
							//nothing
						}else{
							tabContainer.activeTabById(allTabs[0].id);
						}
						
					}
					//处理滚动位置
					var ul=tabContainer.options.tabsUl;
					ul.css("left",0);
					tabContainer.options.moveIndex=0;
					
					
					
				}
			},checkExistByTabId:function(tablId){
				//检测是否存在
				var tabContainer=$(this);
				var exist=tabContainer.find("#"+tablId);
				return (exist&&exist.length==1);
			},closeAllTab:function(){
				//关闭所有tab
				var tabContainer=$(this);
				var allTabs=tabContainer.options.allTabs;
				var size=allTabs.length;
				if(size>0){
					var mainIframeBox=tabContainer.options.mainIframeBox;
					mainIframeBox.find("iframe").hide();
					for(var i in allTabs){
						if(!(allTabs[i].noClose)){
							tabContainer.find("#"+allTabs[i].id).remove();
							mainIframeBox.find("#"+allTabs[i].id+"_iframe").remove();
							var index=tabIndexInTabsArray(tabContainer.options.allTabs,allTabs[i].id);
							tabContainer.options.allTabs=arrayDelByIndex(tabContainer.options.allTabs,index);
						}
					}
					var remainingCount=tabContainer.options.allTabs.length;
					if(remainingCount>0){
						tabContainer.activeTabById(allTabs[0].id);
					}
					//处理滚动位置
					var ul=tabContainer.options.tabsUl;
					ul.css("left",0);
					tabContainer.options.moveIndex=0;
				}
				
			},closeTab:function(tab){
				//关闭指定的tab
				if(!tab||tab.length==0){
					return false;
				}
				
				//激活指定的tab
				var tabContainer=$(this);
				hidePortalLoading(tabContainer.options.mainBoxId);
				var tabId=tab.attr("id");
				var lastTabId=tab.data("lasttabid");
				if(tabId){
					var mainIframeBox=tabContainer.options.mainIframeBox;
					//判断有没有iframe
					var iframe=mainIframeBox.find("#"+tabId+"_iframe");
						var size=tabContainer.options.allTabs.length;
					if(iframe&&iframe.length==1){
						
						if(tab.hasClass("active")){
							mainIframeBox.find("iframe").hide();
						 
						//先隐藏 找到附近的
						tab.hide();
						iframe.hide();
						
						
						if(size<=1){
							tab.remove();
							iframe.remove();
							//清空
							tabContainer.options.allTabs=[];
						}else{
							var index=tabIndexInTabsArray(tabContainer.options.allTabs,tabId);
							if(index!=size-1){
								if(lastTabId){
									if(tabContainer.checkExistByTabId(lastTabId)){
										tabContainer.activeTabById(lastTabId);
									}else{
										//显示下一个
										var next=tabContainer.options.allTabs[index+1];
										tabContainer.activeTabById(next.id);
									}
								}else{
									//显示下一个
									var next=tabContainer.options.allTabs[index+1];
									tabContainer.activeTabById(next.id);
								}
								tabContainer.options.allTabs=arrayDelByIndex(tabContainer.options.allTabs,index);
							}else if(index>0){
								if(lastTabId){
									if(tabContainer.checkExistByTabId(lastTabId)){
										tabContainer.activeTabById(lastTabId);
									}else{
										var prev=tabContainer.options.allTabs[index-1];
										tabContainer.activeTabById(prev.id);
									}
								}else{
									var prev=tabContainer.options.allTabs[index-1];
									tabContainer.activeTabById(prev.id);
								}
								tabContainer.options.allTabs=arrayDelByIndex(tabContainer.options.allTabs,index);
							}
							tab.remove();
							iframe.remove();
						}
						}else{
							var index=tabIndexInTabsArray(tabContainer.options.allTabs,tabId);
							tabContainer.options.allTabs=arrayDelByIndex(tabContainer.options.allTabs,index);
							tab.remove();
							iframe.remove();
						}
						 
						}else{
							var index=tabIndexInTabsArray(tabContainer.options.allTabs,tabId);
							tabContainer.options.allTabs=arrayDelByIndex(tabContainer.options.allTabs,index);
							tab.remove();
							
						}
						
					}
				tabContainer.moveToRight();
				
				
				
			},processTabEvent:function(){
				//处理tab组件上的点击事件
				var tabContainer=$(this);
				//初始化菜单
				var rightMenuOptions = {items:[
				  {header: '选项卡操作菜单'},
				   {divider: true},
				  {text: '刷新', onclick: function() {
				  	tabContainer.activeTab(rightmenuTab);
				  	tabContainer.reloadTab(rightmenuTab);
				  }},
				  {text: '关闭左侧', onclick: function() {
				  	tabContainer.activeTab(rightmenuTab);
				  	tabContainer.closeLeftTabs(rightmenuTab);
				  }},
				  {text: '关闭右侧', onclick: function() {
				  		tabContainer.activeTab(rightmenuTab);
				  		tabContainer.closeRightTabs(rightmenuTab);
				  }},
				  {text: '关闭其它', onclick: function() {
				  	tabContainer.activeTab(rightmenuTab);
				  	tabContainer.closeOtherTabs(rightmenuTab);
				  }},
				  {divider: true},
				  {text: '关闭所有', onclick:function(){
				  	tabContainer.closeAllTab();
				  }}
				],before:function(){
				  	
				  }}
				var rightmenuTab;
				tabContainer.find(".j_tabs_box").on("click","li",function(){
					var li=$(this);
					tabContainer.activeTab(li,true);
				}).on("mousedown","li",function(e){
					if(e.which==3){
						rightmenuTab=$(this).contextify(rightMenuOptions);
					}
					 
				}).on("click",".j_tab_left",function(){
					tabContainer.moveToLeft();
				}).on("click",".j_tab_right",function(){
					tabContainer.moveToRight();
				}).on("click","li>i.close",function(e){
					e.stopPropagation();
					e.preventDefault()
					tabContainer.closeTab($(this).parent());
					return false;
				});
				
				
				
				
			},moveToLeft:function(auto){
				var tabContainer=$(this);
				if(tabContainer.options.moving){return false;}
				tabContainer.options.moving=true;
				var box=tabContainer.options.tabBox;
				var ul=tabContainer.options.tabsUl;
				var box_width=parseInt(box.width());
				var ul_width=parseInt(ul.width());
				var ul_left=parseInt(ul.css("left"));
				//计算有效长度
				var allTabs=tabContainer.options.allTabs;
				var size=allTabs.length;
				var moveIndex=tabContainer.options.moveIndex;
				if(size>0&&moveIndex<=size-1){
					var allTabsWidth=0;
					for(var i in allTabs){
						allTabsWidth+=parseInt($("#"+allTabs[i].id).width())+30;
					}
					if(allTabsWidth>ul_width){
						
						var w1=parseInt($("#"+allTabs[moveIndex].id).width())+30;
						if(auto&&moveIndex<=2){
							var w2=parseInt($("#"+allTabs[moveIndex+1].id).width())+30
							ul.css("left",(ul_left-w1-w2));
							tabContainer.options.moveIndex=moveIndex+2;
						}else{
							ul.css("left",(ul_left-w1));
							tabContainer.options.moveIndex=moveIndex+1
						}
						
						
					}
					
				}
				setTimeout(function(){
						tabContainer.options.moving=false;
				},300);
				
				
			},moveToRight:function(){
				var tabContainer=$(this);
				if(tabContainer.options.moving){return false;}
				tabContainer.options.moving=true;
				var ul=tabContainer.options.tabsUl;
				var ul_left=parseInt(ul.css("left"));
				var allTabs=tabContainer.options.allTabs;
				var size=allTabs.length;
				var moveIndex=tabContainer.options.moveIndex;
				if(ul_left<0&&size>0&&moveIndex>0){
							var w=parseInt($("#"+allTabs[moveIndex-1].id).width())+30;
							ul.css("left",(ul_left+w));
							tabContainer.options.moveIndex=moveIndex-1;
				}
				if(moveIndex==0&&ul_left!=0){
						ul.css("left",0);
						tabContainer.options.moveIndex=0;
				}
				setTimeout(function(){
						tabContainer.options.moving=false;
				},300);
			
			}
		});
	})(jQuery);

   

/**
   * select工具类
   */
  var SelectUtil={
		  /**
		   * 处理select
		   * setting selectId parent callback
		   */
		   autoLoad:function(setting){
			   var processItems=function(html,list,appendHandler){
					for(var i in list){
  						var option = '<option value="'+list[i].value+'">&nbsp;&nbsp;&nbsp;&nbsp; ∟'+list[i].text+'</option>';
  						if(appendHandler){
							option=appendHandler(option,list[i]);
						}
  						html+=option;
  					}
					return html;
			   }
			   var insert=function(_this,refreshing){
		      		var selectedValue=_this.data("select");
		      		if(refreshing){
		      			selectedValue=_this.val();
		      		}
		      		var handler=_this.data("handler");
		      		var appendHandler = _this.data("append");
		      		if(appendHandler){
						appendHandler=eval(appendHandler);
  					}
		      		_this.empty();
		      		if(_this.data("text")){
		      			_this.append('<option value="'+_this.data("value")+'">'+_this.data("text")+'</option>');
		      		}
		      		var url=null;
		      		if(setting&&setting.url){
		      			url=setting.url;
		      		}else{
		      			url=_this.data("url");
		      		}
		      		if(url!=null){
		      			$.ajax({
			      			type:"GET",
			      			url:url,
			      			dataType:"json",
			      			timeout : 10000, //超时时间设置，单位毫秒
			      			context:_this,
			      			success:function(result){
			      				if(refreshing){
			      					LayerMsgBox.closeLoading();
			      				}
			      				if(result.state=="ok"){
			      					var html="";
			      					var list=result.data;
			      					for(var i in list){
			      						var option = '<option value="'+list[i].value+'">'+list[i].text+'</option>';
			      						if(appendHandler){
											option=appendHandler(option,list[i]);
										}
			      						html+=option;
			      						var items=list[i].items;
			      						if(items&&items.length>0){
			      							html=processItems(html,items,appendHandler);
			      						}
			      					}
			      					_this.append(html);
			      					if(selectedValue||(typeof(selectedValue)=="boolean")){
			      						selectedValue=selectedValue.toString();
			      						if(selectedValue.indexOf(",")!=-1){
				      						var arr=selectedValue.split(",");
				      						_this.val(arr);
				      					}else{
				      						_this.val(selectedValue);
				      					}
			      						if(!_this.val()){
			      							var options=_this.find("option");
			      							if(options&&options.length>0){
			      								_this.val(options.eq(0).val());
			      							}
			      						}
			      					}
			      					
			      					
			      					/*if(_this.hasClass("linkage")){
			      						_this.change();
			      					}*/
			      					_this.change();
			      				}
			      				if(setting&&setting.handler){
			      					setting.handler(_this);
			      				}
			      				if(handler){
									var exe=eval(handler);
									if(exe){
										exe(_this);
									}
								}
			      			}
			      		});
		      		}
		      		
		      	}
		      	var select=null;
		      	if(setting){
		      		if(setting.selectId){
		      			if(setting.parent){
		      				if(typeof setting.parent=="object"){
		      					select=setting.parent.find("#"+setting.selectId);
		      				}else{
		      					if(setting.parent.indexOf("#")!=-1){
		          					select=$(setting.parent).find("#"+setting.selectId);
		          				}else{
		          					select=$("#"+setting.parent).find("#"+setting.selectId);
		          				}
		      				}
		      				
		      			}else{
		      				select=$("#"+setting.selectId);
		      			}
		      			
		      		}else{
		      			if(setting.parent){
		      				if(typeof setting.parent=="object"){
		      					select=setting.parent.find("select[data-autoload]");
		      				}else{
		  	    				if(setting.parent.indexOf("#")!=-1){
		  	    					select=$(setting.parent).find("select[data-autoload]");
		  	    				}else{
		  	    					select=$("#"+setting.parent).find("select[data-autoload]");
		  	    				}
		      				}
		      			}else{
		      				select=$("select[data-autoload]"); 
		      			}
		      		}
		      	}else{
		      		select=$("select[data-autoload]");
		      	}
		      	select.each(function(i,obj){
		      		var _this=$(this);
		      		var islinkage=_this.data("linkage");
		      		//if(_this.data("toggle")=="autoselect"&&islinkage){
		      			_this.unbind("change");
		      		//}
		      		_this.on("change",function(){
		      			var beforechange=_this.data("beforechange");
		      			if(beforechange){
							var exe=eval(beforechange);
							if(exe){
								exe(_this);
							}
						}
		      			var sonId=_this.data("sonid");
		      			if(islinkage&&sonId){
		      				var srcUrl=$("#"+sonId).data("srcurl");
		      				var url="";
		      				if(srcUrl){
		      					url=srcUrl+"/"+_this.val();
		      				}else{
		      					url=$("#"+sonId).data("url")+"/"+_this.val();
		      				}
		      				SelectUtil.autoLoad({parent:_this.parents("form"),selectId:sonId,url:url});
		      			}
		      		});
		      		if((_this.data("url")||setting.url)){
		  	    		insert(_this);
		  	    		if(_this.data("refresh")){
		  	    			var exist=_this.parent().find(".glyphicon-refresh");
		  	    			if(exist&&exist.size()>0){
		  	    				exist.parent().remove();
		  	    			}
		  	    			
		  	    			var refreshBtn=document.createElement("div");
		  	    			refreshBtn.className="input-group-addon handcursor";
		  	    			refreshBtn.innerHTML='<span class="glyphicon glyphicon-refresh"></span>';
		  	    			$(refreshBtn).click(function(){
		  	    				LayerMsgBox.loading("正在刷新数据...",10000);
		  	    				insert(_this,true);
		  	    			});
		  	    			obj.parentElement.appendChild(refreshBtn);
		  	    			
		  	    		}
		  	    		
		  	    		
		      		}else{
		      			var selectedValue=_this.data("select");
		      			if(selectedValue){
		      				_this.val(selectedValue);
		      			}
		      		}
		      	});
		      },
  /**
   * 设置select选中值
   * @param id
   * @param value
   */
   setValue:function(id,value,defaultValue){
	  if(value){
		  $("#"+id).val(value);
	  }else{
		  if(defaultValue){
			  $("#"+id).val(defaultValue);
		  }
	  }

  },initAutoSetValue:function(parentId){
	  $(parentId?("#"+parentId):"body").find("select[data-autosetvalue]").each(function(){
		  var select=$(this);
		  var value=select.data("autosetvalue");
		  select.val(""+value);
	  });
  }
  }
 
  
/**
 * checkbox工具类封装
 */
var CheckboxUtil={
		  init:function(parentId){
			  var that=this;
			  var checkboxs=null;
			  if(parentId){
				  checkboxs=$('#'+parentId).find("[data-checkbox]")
			  }else{
				  checkboxs=$("body").find("[data-checkbox]");
			  }
			  if(checkboxs&&checkboxs.length>0){
				  checkboxs.each(function(){
					var ck=$(this);
					var handler=ck.data("handler");
					var name=ck.data("name");
					ck.find("input[type='checkbox'][name='"+name+"']").unbind("change").on("change",function(){
						  if(handler){
							  var exe=eval(handler);
							  if(exe){
								  var input=$(this);
								  exe(input,input.is(":checked"));
							  }
						  }
					  });
					that.setChecked(name,ck.data("value"),ck.data("default"));
				 });
			  }
		  },
		  checkByArray:function(name,values){
			  values=values.toString();
			  if(values.indexOf(",")!=-1){
				  var arr=values.split(",");
				  if(arr&&arr.length>0){
					  for(var i in arr){
						  var input=$("input[type='checkbox'][name='"+name+"'][value='"+arr[i]+"']");
						  input.attr("checked","checked");
					  }
				  }
			  }else{
				  var input=$("input[type='checkbox'][name='"+name+"'][value='"+values+"']");
				  input.attr("checked","checked");
			  }
			  
			  
			  
		  },
		  setChecked:function(name,value,defaultValue){
			  var that=this;
			  if(value){
				  that.checkByArray(name,value);
			  }else{
				  if(defaultValue||defaultValue==0||defaultValue=="0"){
						  that.checkByArray(name,defaultValue);
				  }
			  }
			 
		  }
}
/**
 * radio工具类封装
 */
var RadioUtil={
		  init:function(parentId){
			  var that=this;
			  var radios=null;
			  if(parentId){
				  radios=$('#'+parentId).find("[data-radio]")
			  }else{
				  radios=$("body").find("[data-radio]");
			  }
			  if(radios&&radios.length>0){
				  radios.each(function(){
					  var r=$(this);
					  var value=r.data("value");
					  if(!value){value="";}else{value=value+""}
					  var defaultValue=r.data("default");
					  if(!defaultValue){defaultValue="";}else{defaultValue=defaultValue+""}
					  that.setChecked(r.data("name"),value,defaultValue,r.data("handler"));
				  });
			  }
		  },
		  setChecked:function(name,value,defaultValue,handler){
			  if(handler){
				  var exe=eval(handler);
				  if(exe){
					  $("input[type='radio'][name='"+name+"']").on("click",function(){
						  var r= $(this);
						  var val=r.val();
						  exe(r,val);
					  });
				  }
				 
			  }
			  if(value&&value.length>0){
				  $("input[type='radio'][name='"+name+"'][value='"+value+"']").click();
			  }else{
				  if(defaultValue){
					  if(defaultValue=="all"){
						 $("input[type='radio'][name='"+name+"'][data-all]").click();
					  }else{
						  $("input[type='radio'][name='"+name+"'][value='"+defaultValue+"']").click();
					  }
					 
				  }
			  }
		  }
}
  //表单中的时间选择组件
  var FormDate={
		  init:function(parentId){
			  var dates=null;
			  if(parentId){
				  dates=$('#'+parentId).find(".form-date")
			  }else{
				  dates=$("body").find(".form-date");
			  }
			  var hasDate=(dates&&dates.length>0);
			  if(hasDate){
				  dates.attr("readonly","readonly");
				  dates.each(function(){
					  var date=$(this);
					  var dateType=date.data("type");
					  if(!dateType){
						  dateType="date";
					  }
					  var datefmt=date.data("fmt");
					  if(!datefmt){
						  switch (dateType) {
						  case "date":
							  datefmt="yyyy-MM-dd";
							  break;
						  	case "time":
							  datefmt="HH:mm";
							  break;
							case "datetime":
								datefmt="yyyy-MM-dd HH:mm";
								break;
							default:
								datefmt="yyyy-MM-dd";
								break;
							}
					  }
					  var id=date.attr("id");
					  if(!id){
						  id=date.attr("name");
						  id=id.replace(".","");
						  date.attr("id",id);
					  }
					 laydate.render({
						 elem:"#"+id,
						 type:dateType, //日期格式
						 format:datefmt
					 }); 
				  });
			  }
		  }
  }
 
  
var JBoltMsgBox={
				alert:function(info,desc,type){
					sweetAlert(info,desc,type);
				},
				confirm:function(title,text,handler,noCancel){
						swal({ 
							  title: title, 
							  text: text, 
							  type: "warning",
							  showCancelButton: noCancel?false:true, 
							  confirmButtonColor: "#DD6B55",
							  confirmButtonText: "确定！", 
							  closeOnConfirm: false,
							  showLoaderOnConfirm: true, 
							},
							function(){
								if(handler){
									handler();
								}
							});
					},
					/**
					 * 弹出成功信息,并执行回调方法
					 * @param msg
					 * @param time
					 * @param handler
					 */
					success:function(msg,time,handler){
						if(!msg){msg="操作成功";}
						if(!time){time=1000;}
						swal({ 
							  title: msg, 
							  type: "success",
							  showCancelButton: false, 
							  timer: time, 
							  showConfirmButton: false 
							},
							function(){
								if(handler){
									handler();
								}
							});
						setTimeout(function(){
							sweetAlert.close();
						}, time);
						
					},error:function(msg,time,handler){
						if(!msg){msg="错误";}
						if(!time){time=1500;}
						swal({ 
							  title: msg, 
							  type: "error",
							  showCancelButton: false, 
							  timer: time, 
							  showConfirmButton: false 
							},
							function(){
								if(handler){
									handler();
								}
							});
						setTimeout(function(){
							sweetAlert.close();
						}, time);
					},close:function(){
						sweetAlert.close();
					}
		  
  }  
//msg模块封装
var LayerMsgBox={
		alert:function(msg,icon,handler){
			if(icon){
				layer.alert(msg,{icon:icon}, function(index){
						if(handler){
							handler();
						}
					  layer.close(index);
					});  
			}else{
				layer.alert(msg, function(index){
					if(handler){
						handler();
					}
				  layer.close(index);
				});  
			}
			
		},
		confirm:function(msg,handler,cancelHandler){
			layer.confirm(msg, {icon: 3, title:'提示'}, function(index){
				if(handler){
					handler();
				}
				layer.close(index);
			},function(index){
				if(cancelHandler){
					cancelHandler();
				}
				layer.close(index);
			});
		},
		/**
		 * 弹出成功信息,并执行回调方法
		 * @param msg
		 * @param time
		 * @param handler
		 */
		success:function(msg,time,handler){
			if(!msg){msg="操作成功";}
			if(!time){time=1000;}
			var index=layer.msg(msg,{time:time,icon:1},function(){
				if(handler){
					handler();
				}
			});
			return index;
		},


		/**
		 * 弹出Error,并执行回调方法
		 * @param msg
		 * @param time
		 */
		error:function(msg,time,handler){
			if(!msg){msg="错误";}
			if(!time){time=1500;}
			var index=layer.msg(msg,{time:time,icon:2},function(){
				if(handler){
					handler();
				}
			});
			return index;
		},
		prompt:function(title,defaultMsg,handler,type){
			if(type==undefined){
				type=2;
			}
			var i=layer.prompt({title: title,value:(defaultMsg?defaultMsg:""),formType: type}, function(text, index){
				if(handler){
					handler(index,text);
				}
			});
			return i;
		},
		/**
		 * 弹出进度
		 * @param msg
		 * @param time
		 */
		loading:function(msg,time,handler){
			if(!msg){msg="执行中...";}
			var index=null;
			if(time){
				index=layer.msg(msg,{time:time,icon:16,shade:0.3},function(){
					if(handler){
						handler();
					}
				});
			}else{
				index=layer.msg(msg,{icon:16});
			}
			return index;
		},
		close:function(index){
			layer.close(index);
		},
		closeAll:function(type){
			if(type){
				layer.closeAll(type);
			}else{
				layer.closeAll();
			}
		},
		closeLoading:function(){
			setTimeout(function(){
				layer.closeAll('dialog'); //关闭加载层
			}, 500);
		},
		closeLoadingNow:function(){
				layer.closeAll('dialog'); //关闭加载层
		},
		load:function(type,time){
			if(time){
				layer.load(type,{time:time});
			}else{
				layer.load(type);
			}
		},
		closeLoad:function(){
			setTimeout(function(){
				layer.closeAll('loading'); //关闭加载层
			}, 500);
		}

}
  /**
   * switchBtn enableBtn
   */
  var EnableBtn={
		  init:function(parentId){
			  var parentId=parentId?("#"+parentId):"body";
			  $(parentId).on("click","img[data-toggle='enableButton']",function(){
					var _btn=$(this);
					var url=_btn.data("url");
					var src=_btn.attr("src");
					var hander=_btn.data("handler");
					if(url){
							LayerMsgBox.loading("正在执行...");
							$.ajax({
								type:"post",
								url:url,
								dataType:"json",
								success:function(data){
									if(data.success){
										LayerMsgBox.success("操作成功",1000);
										var on=src.indexOf("off")!=-1;
										if(src.indexOf("off")!=-1){
											src=src.replace("off","on");
										}else{
											src=src.replace("on","off");
										}
										_btn.attr("src",src);
										if(hander){
											var exe=eval(hander);
											if(exe){
												exe(_btn,on);
											}
										}
									}else{
										LayerMsgBox.alert(data.msg,2);
									}
								},
								error:function(){
									LayerMsgBox.alert("操作失败",2);
								}
							});
					}else{
						LayerMsgBox.alert("组件未设置URL地址",2);
					}
				});
		  }
  }

  var disableFormInput=function(){
	//禁用Enter键表单自动提交
	  document.onkeydown = function(event) {
	      var target, code, tag;
	      if (!event) {
	          event = window.event; //针对ie浏览器
	          target = event.srcElement;
	          code = event.keyCode;
	          if (code == 13) {
	              tag = target.tagName;
	              if (tag == "TEXTAREA") { return true; }
	              else { return false; }
	          }
	      }
	      else {
	          target = event.target; //针对遵循w3c标准的浏览器，如Firefox
	          code = event.keyCode;
	          if (code == 13) {
	              tag = target.tagName;
	              if (tag == "INPUT") { return false; }
	              else { return true; }
	          }
	      }
	  };
  }

//PageOpt初始化工具
  var PageOptUtil={
		  init:function(parentId){
			  var self=this;
			  var parentId=parentId?("#"+parentId):"body";
			  self.initDialogOptEvent(parentId);
			  self.initAjaxLinkEvent(parentId);
		  },
		  //初始化弹出dialog的按钮
		  initDialogOptEvent:function(parentId){
			  $(parentId).on("click","[data-dialogbtn]",function(e){
				  e.preventDefault();
				  e.stopPropagation();
				  
				  var target=$(this).data("target");
				  if(target=="parent"){
				  	parent.DialogUtil.openBy(this);
				  }else if(target=="outparent"){
				  	parent.parent.DialogUtil.openBy(this);
				  }else{
				  	 DialogUtil.openBy(this);
				  }
				  return false;
			  });
		  },
		  initAjaxLinkEvent:function(parentId){
			  $(parentId).on("click","[data-toggle='ajax']",function(e){
				  e.preventDefault();
				  e.stopPropagation();
				  var action=$(this);
				  var url=action.attr("href");
				  if(!url){
					  url=action.data("url");
				  }
				  if(!url){
					  alert("请设置URL地址");
					  return false;
				  }
				  var okhandler=action.attr("handler");
				  if(!okhandler){
					  okhandler=action.data("handler");
				  }
				  var dataconfirm=action.data("confirm");
				  var ajaxFun=function(){
					  LayerMsgBox.loading();
					  //开始执行ajax
					  Ajax.get(url,function(data){
						  
						  if(okhandler){
							  LayerMsgBox.closeLoadingNow();
							  if(okhandler=="removeTr"){
								  removeTr(action);
							  }else{
								  var exe=eval(okhandler);
									if(exe){
										exe(data);
									}
							  }
							 
						  }else{
							  LayerMsgBox.closeLoading();
						  }
					  });
				  }
				  if(dataconfirm){
					  LayerMsgBox.confirm(dataconfirm, ajaxFun);
				  }else{
					  ajaxFun();
				  }
				 
				  return false;
			  });
		  }
  }
 
  //table初始化工具
  var TableUtil={
		  init:function(parentId){
			  var self=this;
			  var parent=parentId?("#"+parentId):"body";
			  $(parent).find("table").each(function(){
					var tableId=$(this).attr("id");
					if(!tableId){
						tableId=randomId();
						$(this).attr("id",tableId);
					}
					self.initDelOptEvent(tableId);
					self.initEditOptEvent(tableId);
					
				});
			  
		  },
		  //初始化删除按钮
		  initDelOptEvent:function(tableId){
			  if(tableId.indexOf("#")==-1){
				  tableId="#"+tableId;
			  }
			  $(tableId).on("click",'.j_table_del',function(e){
				  e.preventDefault();
				  e.stopPropagation();
				  var action=$(this);
				  var url=action.attr("href");
				  if(!url){
				  	url=action.data("url");
				  }
				  var okhandler=action.attr("handler");
				  if(!okhandler){
					  okhandler=action.data("handler");
				  }
				  var confirm=action.data("confirm");
				  LayerMsgBox.confirm(confirm?confirm:"确定删除此项？", function(){
					  LayerMsgBox.loading();
					  //开始执行ajax
					  Ajax.get(url,function(){
						  LayerMsgBox.closeLoading();
						  LayerMsgBox.success("操作成功");
						  if(okhandler){
							  if(okhandler=="removeTr"){
								  removeTr(action);
							  }else{
								  var exe=eval(okhandler);
									if(exe){
										exe();
									}
							  }
							 
						  }
					  });
				  });
				  return false;
			  });
		  },
		//初始化删除按钮
		  initEditOptEvent:function(tableId){
			  if(tableId.indexOf("#")==-1){
				  tableId="#"+tableId;
			  }
			  $(tableId).on("click",'.j_table_edit',function(e){
				  e.preventDefault();
				  e.stopPropagation();
				  var target=$(this).data("target");
				  if(target=="parent"){
				  	parent.DialogUtil.openBy(this);
				  }else if(target=="outparent"){
				  	parent.parent.DialogUtil.openBy(this);
				  }else{
				  	 DialogUtil.openBy(this);
				  }
				  return false;
			  });
		  }
  }
  /**
   * 检测文件大小
   * @param file 
   * @param maxSize kb单位
   * @returns
   */
  function validateFileMaxSize(file,maxSize){
	  var fileSize=(file.files[0].size/1024).toFixed(1);
	  var gt=(fileSize>maxSize);
	  var formateSize=fileSize+"KB";
	  if(fileSize>1024){
		  formateSize=((fileSize/1024).toFixed(1))+"M";
	  }
	  if(gt){LayerMsgBox.alert("您选择的文件["+formateSize+"],上传限制不能超过 "+maxSize+"KB",2);}
      return gt;
  }
  
  //限制上传文件的类型和大小
  function validateExcel(file,maxSize){
	  // 返回 KB，保留小数点后两位
	  var fileName = file.value;
	  if(!/.(xls|xlsx)$/.test(fileName)){
		  LayerMsgBox.alert("文件类型必须是xls,xlsx中的一种",2);
		  return false;
	  }
	  if(validateFileMaxSize(file,maxSize)){
		  return false;
	  }
	  return true;
  }
  //限制上传文件的类型和大小
  function validateNormal(file,maxSize){
	  // 返回 KB，保留小数点后两位
	  var fileName = file.value;
	  if(!/.(xls|xlsx|jpg|jpeg|png|JPG|rar|zip|pdf|mp4|flv|mp3|doc|docx)$/.test(fileName)){
		  LayerMsgBox.alert("此文件类型不允许上传",2);
		  return false;
	  }
	  if(validateFileMaxSize(file,maxSize)){
		  return false;
	  }
	  return true;
  }
  /**
   * 判断是不是img
   */
  function isImg(fileName){
	  return /.(jpg|jpeg|png|JPG)$/.test(fileName);
  }
  //限制上传文件的类型和大小
  function validateImg(file,maxSize){
      // 返回 KB，保留小数点后两位
      var fileName = file.value;
      if(isImg(fileName)==false){
    	  	 LayerMsgBox.alert("图片类型必须是jpeg,jpg,png中的一种",2);
             return false;
       }
      if(validateFileMaxSize(file,maxSize)){
    	  return false;
      }
      return true;
  }
  //验证file
  function validateFile(file,accept,maxSize){
	  	var ele=file[0];
	  	//默认两M
	  	if(!maxSize){maxSize=1024*1024*1024*2;}
	  	var passValidate=true;
	  	if(accept){
			switch (accept) {
			case "img":
				passValidate=validateImg(ele,maxSize);
				break;
			case "excel":
				passValidate=validateExcel(ele,maxSize);
				break;
			case "file":
				passValidate=validateNormal(ele,maxSize);
				break;
			}
		}else{
			passValidate=validateNormal(ele,maxSize);
		}
	  	return passValidate;
  }
  
  //建立一個可存取到該file的url
  function getObjectURL(ele) {
	  var file=ele.files[0];
	  var url = null ;
	  if (window.createObjectURL!=undefined) { // basic
		  url = window.createObjectURL(file);
	  } else if (window.URL!=undefined) { // mozilla(firefox)
		  url = window.URL.createObjectURL(file);
	  } else if (window.webkitURL!=undefined) { // webkit or chrome
		  url = window.webkitURL.createObjectURL(file) ;
	  }
	  return url ;
  }
  //专门图片上传组件
  var JBoltImgUploader={
		  tpl:'<input type="file" {@if rule}data-rule="${rule}"{@/if} name="${fileName}"><p class="j_img_uploder_msg"><span class="j_file_name"></span><i class="fa fa-remove j_text_danger j_remove_file"></i></p>',
		  init:function(parentId){
				var that=this;
				var parent=parentId?("#"+parentId):"body";
				var imgBoxs=$(parent).find(".j_img_uploder");
				imgBoxs.each(function(){
					var box=$(this);
					JBoltImgUploader.initSingle(box);
				});
				
		  },
		  initSingle:function(box){
			  var that=this;
			  var fileName=box.data("name");
				var rule=box.data("rule");
				var area=box.data("area");
				if(area){
					var arr=area.split(",");
					box.css({
						"width":arr[0],
						"height":arr[1]
					})
				}
				if(!fileName){
					fileName="file";
				}
				box.html(juicer(that.tpl,{fileName:fileName,rule:rule}));
				var value=box.data("value");
				if(value){
					var bg="#999 url("+value+") center center no-repeat";
					box.css({
						"background":bg,
						"background-size":"100%"
					});
					box.find("p.j_img_uploder_msg").show();
				}
				$(box).on("change","input[type='file']",function(){
					var file=$(this);
					that.changeFile(file);
				}).on("click",".j_remove_file",function(){
					var removefile=$(this);
					that.removeFile(removefile);
				});

		  },
		  removeFile:function(removeBtn){
			  var uploder=removeBtn.closest(".j_img_uploder");
			  var removehandler=uploder.data("removehandler");
				uploder.find("input[type='file']").val("");
				uploder.find("span.j_file_name").text("");
				uploder.find("p.j_img_uploder_msg").hide();
				uploder.css({
					"background":"url('assets/img/uploadimg.png') center center no-repeat",
					"background-size": "100%"
				});
				console.log(removehandler);
				if(removehandler){
					var exe=eval(removehandler);
					if(exe){
						exe(uploder);
					}
				}
		  },
		  changeFile:function(file){
			  var uploder=file.closest(".j_img_uploder");
				var maxSize=uploder.data("maxsize");
				var handler=uploder.data("handler");
				var fileValue=file.val();
				if(fileValue){
					if(validateFile(file,"img",maxSize)){
						var arr=fileValue.split('\\');
						var fileName=arr[arr.length-1];
						uploder.find("span.j_file_name").text(fileName).attr("title",fileName);
						uploder.find("p.j_img_uploder_msg").show();
						uploder.closest(".form-group").removeClass("has-error");
						//出预览图
						var url=getObjectURL(file[0]);
						if(url){
							uploder.css({
								"background":"#999 url('"+url+"') center center no-repeat",
								"background-size":"100%"
							});
						}
							
					}else{
						file.val("");
					}
				}else{
					uploder.find("input[type='file']").val("");
					uploder.find("span.j_file_name").text("");
					uploder.find("p.j_img_uploder_msg").hide();
					uploder.css({
						"background":"url('assets/img/uploadimg.png') center center no-repeat",
					});
				}
				if(handler){
					var exe=eval(handler);
					if(exe){
						exe(file.val(),file);
					}
				}
		  }
  }
  /**
   * 上传组件封装
   */
  var JBoltUploadUtil={
		tpl:'<div class="j_upload_file"><input type="file" {@if rule}data-rule="${rule}"{@/if} name="${fileName}" /></div><p class="j_upload_file_box_msg"><span class="j_file_name"></span><i class="fa fa-remove j_text_danger j_remove_file"></i></p>',
		init:function(parentId){
			var that=this;
			var parent=parentId?("#"+parentId):"body";
			var fileBoxs=$(parent).find(".j_upload_file_box");
			fileBoxs.each(function(){
				var box=$(this);
				var fileName=box.data("name");
				var rule=box.data("rule");
				if(!fileName){
					fileName="file";
				}
				box.html(juicer(that.tpl,{fileName:fileName,rule:rule}));
			});
			
			fileBoxs.find("input[type='file']").on("change",function(){
				var file=$(this);
				var box=file.closest(".j_upload_file_box");
				var accept=box.data("accept");
				var maxSize=box.data("maxsize");
				var handler=box.data("handler");
				var fileValue=file.val();
				if(fileValue){
					if(validateFile(file,accept,maxSize)){
						var arr=fileValue.split('\\');
						var fileName=arr[arr.length-1];
						box.find("span.j_file_name").text(fileName);
						box.find("p.j_upload_file_box_msg").show();
						box.find(".j_upload_file").addClass("j_reupload");
						box.closest(".form-group").removeClass("has-error");
						var imgpreview=box.data("imgpreview");
						//如果是图片 而且设置了要出预览 就出预览图
						if(imgpreview){
							if(isImg(fileName)){
								var imgpreviewBox=$(imgpreview);
								if(imgpreviewBox&&imgpreviewBox.length){
									var url=getObjectURL(file[0]);
									if(url){
										imgpreviewBox.html("<img src='"+url+"'/>");
									}
								}
								
							}
						}
					}else{
						file.val("");
					}
				}else{
					that.clearIt(box);
				}
				
				if(handler){
					var exe=eval(handler);
					if(exe){
						exe(file.val(),box);
					}
				}
			});
			fileBoxs.find(".j_remove_file").on("click",function(){
				var removefile=$(this);
				var box=removefile.closest(".j_upload_file_box");
				that.clearIt(box);
			});
			
			
		},clearIt:function(box){
			box.find("input[type='file']").val("");
			box.find("span.j_file_name").text("");
			box.find("p.j_upload_file_box_msg").hide();
			box.find(".j_upload_file").removeClass("j_reupload");
			var imgpreview=box.data("imgpreview");
			if(imgpreview){
				$(imgpreview).empty();
			}
		}
  }
  //弹出dialog类库
  var DialogUtil={
		  openBy:function(ele){
			  var action=$(ele);
			  var url=action.data("url");
			  if(!url){
				  url=action.attr("href");
			  }
			  if(!url){LayerMsgBox.alert("没有设置dialog的url. href 或者 dialog-url", 2); return false;}
			  var title=action.data("title");
			  var handler=action.attr("handler");
			  var dialog_area=action.data("area");
			  var w="600px";
			  var h="500px";
			  if(dialog_area){
				  var area=dialog_area.split(",");
				  var ww=area[0];
				  var hh=area[1];
				  if(ww.indexOf("px")!=-1||ww.indexOf("%")!=-1){
					  w=ww;
				  }else{
					  w=ww+"px";
				  }
				  if(hh.indexOf("px")!=-1||hh.indexOf("%")!=-1){
					  h=hh;
				  }else{
					  h=hh+"px";
				  }
			  }
			  var dialog_scroll=action.data("scroll");
			  if(!dialog_scroll){
				  dialog_scroll="no";
			  }else{
				  dialog_scroll="yes";
			  }
			  var fs=action.data("fs");
			  if(fs&&(fs=="true"||fs==true)){
				  dialog_scroll="yes";
			  }
			  var cdrfp=action.data("cdrfp");
			  if(cdrfp==undefined){
				  cdrfp=false;
			  }
			  
		      var btn=action.data("btn");
		      
		      this.openNewDialog({
		    	  title:title,
		    	  width:w,
		    	  height:h,
		    	  url:url,
		    	  scroll:dialog_scroll,
		    	  btn:btn,
		    	  handler:handler,
		    	  cdrfp:cdrfp,
		    	  fs:fs
		      });
		  },openNewDialog:function(options){
			  var btn=[];
			  var dbtn=options.btn;
			  if(!dbtn){
		    	  btn=["确定", '关闭'];
		      }else if(dbtn&&dbtn=="no"){
		    	  btn=[];
		      }else if(dbtn&&dbtn=="close"){
		    	  btn=["确定", '关闭'];
		      }
			  var lindex=layer.open({
				  type: 2,
				  title: options.title,
				  shadeClose: false,
				  shade: 0.5,
				  maxmin:true,
				  area: [options.width, options.height],
				  content:[options.url,options.scroll],
				  btn:btn, //只是为了演示
				  yes:function(index){
					  var iframeWin = window[$(".layui-layer-iframe").find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
					  iframeWin.submitThisForm(function(){
						  LayerMsgBox.close(index);
						  if(options.handler){
							  var exe=eval(options.handler);
								if(exe){
									exe();
								}
						  }
					  });
				  },end:function(){
					  if(options.cdrfp){
						  refreshThisTable();
					  }
				  }
			  });
			  if(options.fs){
				  layer.full(lindex);
			  }
			  if(dbtn&&dbtn=="close"){
				  $("#layui-layer"+lindex).find("a.layui-layer-btn0").hide();
			  }
		  }
  }
  
  
  /**
   * 刷新table
   */
  function refreshThisTable(){
	  LayerMsgBox.loading();
	  var searchForm=$(".searchBar form");
	  if(searchForm&&searchForm.length==0){
		  refreshPage();
	  }else{
		  var cur=$(".pages .current_page");
		  if(cur&&cur.length>0){
			  var page=cur.val();
			  if(page){
				  searchForm.append("<input type='hidden' name='pager.currentPage' value='"+page+"' />");
			  }
		  }
		  
		  searchForm.submit(); 
	  }
	 
  }
  
  function refreshPage(){
	  history.go(0);
  }
  /**
   * 删除一行tr
   */
  function removeTr(obj){
	  $(obj).closest("tr").remove();
  }
  
  function openNewTab(options){
	  if (self!= top) { 
		  parent.openNewTab(options);
	  }else{
		  jboltOpenNewTab(options);
	  }
  }
  
  function getCurrentTabId(){
	  if (self!= top) { 
		  return parent.getCurrentTabId();
	  }else{
		 return jboltGetCurrentTabId();
	  }
  }
  
  function closeCurrentTab(){
	  if (self!= top) { 
		  return parent.closeCurrentTab();
	  }else{
		 return jboltCloseCurrentTab();
	  }
  }
  
   
  //tab工具类
  var TabUtil={
		  init:function(parentId){
			  var parentId=parentId?("#"+parentId):"body";
			  $(parentId).on("click","[data-toggle='tab']",function(){
					var obj=$(this);
					var id=obj.data("id");
					var url=obj.data("url");
					if(!url){
						url=obj.attr("href");
					}
					if(!url){
						alert("未设置打开的URL");
						return false;
					}
					var title=obj.data("title");
					if(!title){
						title=obj.text();
					}
					if(!title){
						alert("未设置打开的标题");
						return false;
					}
					var active=obj.data("active");
					var reload=obj.data("reload");
					openNewTab({id:id,url:url,title:title,active:active,reload:reload});
			  });
		  }
  }
  
  
  function initTooltip(){
	  if($("[data-toggle='tooltip']").length>0){
		  $("[data-toggle='tooltip']").tooltip();
	  }
	  if($("[tooltip]").length>0){
		  $("[tooltip]").tooltip();
	  }
  }
/**
 * ajax封装
 */
var Ajax={
		  post:function(url,data,success,error,sync){
			    var async=true;
			    if(sync){async=false;}
				$.ajax({
					url:url,
					type:"post",
					dataType:"json",
					timeout : 60000, //超时时间设置，单位毫秒
					async:async,
					data:data,
					success:function(data){
						if(data.state=="ok"){
							if(success){
								success(data);
							}
						}else{
							LayerMsgBox.alert(data.msg,2);
							if(error){
								error();
							}
						}
					},
					error:function(){
						LayerMsgBox.alert("网络通讯异常",2);
						if(error){
							error();
						}
						
					}
					
				})
			},
			get:function(url,success,error,sync){
				var async=true;
			    if(sync){async=false;}
				$.ajax({
					url:url,
					type:"get",
					dataType:"json",
					timeout : 60000, //超时时间设置，单位毫秒
					async:async,
					success:function(data){
						if(data.state=="ok"){
							if(success){
								success(data);
							}
						}else{
							LayerMsgBox.alert(data.msg,2);
							if(error){
								error();
							}
						}
					},
					error:function(){
						LayerMsgBox.alert("网络通讯异常",2);
						if(error){
							error();
						}
					}
					
				})
			}
}
/**
 * 自动Ajax加载内容的Portal
 */
;(function($){
		$.extend($.fn, {
			ajaxPortal:function(replaceBody,url,replaceOldUrl){
				return this.each(function(){
					var portal=$(this);
					var l_url="";
					if(url){
						l_url=url;
					}else{
						l_url=portal.data("url")
					}
					if(l_url.indexOf("?")!=-1){
						l_url=l_url+"&t="+new Date().getTime();
					}else{
						l_url=l_url+"?t="+new Date().getTime();
					}
					var autoload=portal.data("autoload");
					if(autoload==undefined){
						autoload=true;
					}
					if((replaceBody==undefined&&autoload)||(replaceBody!=undefined)){
						$.get(l_url,function(html){
							if(replaceBody){
								portal.empty().html(html);
							}else{
								portal.append(html);
							}
							portal.find("[data-toggle='ajaxPortal']").ajaxPortal();
							if(replaceOldUrl&&url){
								portal.data("url",url);
							}
							var portalId=portal.attr("id");
							if(!portalId){
								portalId=randomId();
								portal.attr("id",portalId);
							}
							//初始化portal内部组件
							initJbolt(portalId);
						});
					
					}
				});
			}
		});
	})(jQuery);


//弹出tips
var TipsUtil={
		  init:function(parentId){
			  var tips=null;
			  if(parentId){
				  tips=$('#'+parentId).find("[data-tips]");
			  }else{
				  tips=$("body").find("[data-tips]");
			  }
			  var hasTips=tips.length>0;
			  if(hasTips){
				  tips.each(function(){
					 var t=$(this);
					 var trigger=t.data("trigger");
					 if(trigger&&trigger=="click"){
						 var tipsIndex=0;
						 t.on("click",function(e){
							 e.stopPropagation();
							 e.preventDefault();
							  var tipsMsg=$(this).data("content");
							  tipsIndex=layer.tips(tipsMsg, this, {
								  tips: [4, '#3595CC'],
								  time: 10000
								});
							  
							  $("#layui-layer"+tipsIndex).on("click",function(e){
									 e.stopPropagation();
									 e.preventDefault();
								 });
								 $("body").on("click",function(){
									  layer.close(tipsIndex);
								  });
								 
						  });
						
						 
					 }else{
						 var tipsIndex=0;
						 t.on("mouseover",function(){
							  var tipsMsg=$(this).data("content");
							  tipsIndex=layer.tips(tipsMsg, this, {
								  tips: [4, '#3595CC'],
								  time: 4000
								});
						  }).on("mouseout",function(){
							  layer.close(tipsIndex);
						  });
					 }
				  });
			  }
		  }
}


  
  /**
   * 隐藏dialog按钮
   * @returns
   */
  function hideParentLayerDialogBtn(index){
	  if(index){
		  parent.$(".layui-layer-btn").find("a").eq(index-1).hide();
	  }else{
		  parent.$(".layui-layer-btn").hide();
	  }
	 
  }
  /**
   * 隐藏dialog按钮
   * @returns
   */
  function changeParentLayerDialogBtnTitle(index,btnTitle){
	parent.$(".layui-layer-btn").find("a").eq(index-1).text(btnTitle);
  }
  /**
   * 得到按钮
   * @param index
   * @returns
   */
  function getParentLayerDialogBtn(index){
	  return parent.$(".layui-layer-btn").find("a").eq(index-1);
  }
  /**
   * 显示dialog按钮
   * @returns
   */
  function showParentLayerDialogBtn(index){
	  if(index){
		  parent.$(".layui-layer-btn").find("a").eq(index-1).show();
	  }else{
		  parent.$(".layui-layer-btn").show();
	  }
	  
  }
  
  function hideParentLayerDialog(){
  	parent.layer.closeAll();
  }
  
  
  /**
   * 初始化jbolt前端
   * @param {Object} parentId
   */
  function initJbolt(parentId){
	    initTooltip();
		FormDate.init(parentId);
		RadioUtil.init(parentId);
		CheckboxUtil.init(parentId);
		SelectUtil.autoLoad({parent:parentId});
		EnableBtn.init(parentId);
		TipsUtil.init(parentId);
		PageOptUtil.init(parentId);
		TableUtil.init(parentId);
		
		JBoltUploadUtil.init(parentId);
		JBoltImgUploader.init(parentId);
  }
  /**
   * 处理自动刷新机制
   * @returns
   */
  function processAutoReload(){
	  var layerbox=$("div.layui-layer");
	  if(layerbox&&layerbox.size()>0){
		  return false;
	  }
	  var autoReloadForm=$("form.autoReload");
	  if(autoReloadForm&&autoReloadForm.size()>0){
		  var searchBar=autoReloadForm.closest(".searchBar");
		  if(searchBar&&searchBar.size()>0){
			  refreshThisTable();
		  }else{
			  LayerMsgBox.loading("刷新中...",1000);
			  autoReloadForm.submit();
		  }
	  }
  }
function initAjaxPortal(){
	$("[data-toggle='ajaxPortal']").ajaxPortal();
}
/**
 * 初始化表单校验
 */
function initFormValidator(){
	var script=$("#formvalidator");
	if(script&&script.length>0){
		  $.validator.setTheme('bootstrap', {
	        validClass: 'is-valid',
	        invalidClass: 'is-invalid',
	        bindClassTo: '.form-control',
	        formClass: 'n-default n-bootstrap',
	        msgClass: 'n-right'
	    });
	}
  
}
/**
 * 初始化range组件
 */
function initRange(){
	var script=$("#rangeSlider");
	if(script&&script.length>0){
$("input[type='range']").each(function(){
	var range=$(this);
	var options={};
	var min=range.attr("min");
	
	if(!min){min=0;}else{min=Number(min);}
	options.min=min;
	var max=range.attr("max");
	
	if(max){max=Number(max);options.max=max;}
	
	var isdouble=this.hasAttribute("double");
	if(isdouble){
		options.type="double";
	}
	var from=range.attr("from");
	if(from){from=Number(from);options.from=from;}
	var to=range.attr("to");
	if(to){to=Number(to);options.to=to;}
	var prefix=range.attr("prefix");
	if(prefix){options.prefix=prefix;}
	range.ionRangeSlider(options);
});
}
}
				
				
//初始化
$(function(){
	//初始化异步加载portal
	initAjaxPortal();
	//初始化JBolt引擎
	initJbolt();
	//初始化table组件
	TabUtil.init();
	//初始化form表单验证
	initFormValidator();
	//初始化range组件
	initRange();
});