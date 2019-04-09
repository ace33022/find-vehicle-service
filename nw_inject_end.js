/**
 *
 * @description Find Vehicle Service
 *
 * @version 2018/08/23 初始版本。
 *
 * @author ace
 *
 * @see {@link http://requirejs.org/|RequireJS}
 *
 * @see {@link https://jquery.com/|jQuery}
 *
 * @see {@link https://getbootstrap.com/|Bootstrap · The most popular HTML, CSS, and JS library in the world.}
 *
 * @see {@link http://underscorejs.org/|Underscore.js}
 * @see {@link https://github.com/jashkenas/underscore|jashkenas/underscore: JavaScript's utility _ belt}
 *
 * @see {@link https://dev.w3.org/geo/api/|Geolocation API Specifications}
 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Navigator|Navigator - Web APIs | MDN}
 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation|Geolocation - Web APIs | MDN}
 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation/getCurrentPosition|Geolocation.getCurrentPosition() - Web APIs | MDN}
 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation/watchPosition|Geolocation.watchPosition() - Web APIs | MDN}
 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation/clearWatch|Geolocation.clearWatch() - Web APIs | MDN}
 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Position|Position - Web APIs | MDN}
 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Coordinates|Coordinates - Web APIs | MDN}
 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/PositionError|PositionError - Web APIs | MDN}
 * @see {@link https://www.html5rocks.com/en/tutorials/geolocation/trip_meter/|A Simple Trip Meter using the Geolocation API - HTML5 Rocks}
 *
 * @see {@link https://developers.google.com/web/fundamentals/native-hardware/device-orientation/|裝置定向  |  Web  |  Google Developers}
 *
 * @see {@link https://firebase.google.com/docs/|Documentation  |  Firebase}
 * @see {@link https://firebase.google.com/docs/web/setup|Add Firebase to your JavaScript Project  |  Firebase}
 * @see {@link https://firebase.google.com/docs/reference/|Firebase API Reference  |  Firebase}
 * @see {@link https://firebase.google.com/docs/reference/js/|Overview  |  Firebase}
 * @see {@link https://firebase.google.com/docs/reference/js/firebase.database.Reference|Interface: Reference  |  Firebase}
 * @see {@link https://firebase.google.com/docs/database/web/read-and-write|Read and Write Data on the Web  |  Firebase Realtime Database  |  Firebase}
 *
 * @see {@link http://zh-tw.learnlayout.com/position.html|CSS - 關於 position 屬性}
 * @see {@link https://www.oxxostudio.tw/articles/201706/pseudo-element-1.html|CSS 偽元素 ( before 與 after ) - OXXO.STUDIO}
 *
 * @todo 2019/03/21 ace 優化chatbox。
 * @todo 2019/03/18 ace 替換合適的icon圖示。
 * @todo 2019/04/09 ace 再次發出語音通話需求？！一開始拒絕通話，如何再次發起？
 *
 */

Configurations.loadJS(Configurations.requirejsFile, function() {

	requirejs.config(tw.ace33022.RequireJSConfig);
	
	requirejs(["tw.ace33022.util.browser.FormUtils", "leaflet.EasyButton"], function(FormUtils) {
	
		var selfDebug = 1;

		var mapId = 'map' + Math.random().toString(36).substr(2, 6);
		var map = null;
		
		window.navigator.getUserMedia = (window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia || window.navigator.msGetUserMedia);
		
		jQuery('body').append('<div class="container-fluid" style="height: 100%;"></div>');
		
		jQuery(jQuery('.container-fluid')[0]).append('<div id="' + mapId + '" class="row" style="height: 100%;"></div>');
		
		map = L.map(mapId);

		// set map tiles source
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {

				// attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
				maxZoom: 18
			}
		).addTo(map);
		
		map.setView([25.0340, 121.5645], 16);	// Taipei 101
		
		if (typeof window.navigator.geolocation === 'undefined') {
		
			// @todo 2019/03/13 ace 改成顯示無法關閉的視窗。
			FormUtils.showMessage(
			
				'瀏覽器不支援地理定位功能，服務無法順利進行！',
				function() {
				}
			);
		}
		else {
		
			window.navigator.geolocation.getCurrentPosition(
			
				function(position) {
					
					var tag, baseModal;
					var playRole;
					
					map.setView([position.coords.latitude, position.coords.longitude], 16);
					
					baseModal = FormUtils.addBaseModal();
					
					tag = '<div class="modal-body">'
							+ '  <div class="panel-group">'
							+ '    <div class="panel" style="font-size: 36px; font-weight: bold; vertical-align: middle; text-align: center;">'
							+ '      <div class="panel-body" style="border-radius: 6px;" value="0">乘客</div>'
							+ '  	 </div>'
							+ '    <div class="panel" style="font-size: 36px; font-weight: bold; vertical-align: middle; text-align: center;">'
							+ '      <div class="panel-body" style="border-radius: 6px;" value="1">司機</div>'
							+ '    </div>'
							+ '  </div>'
							+	'</div>';
					baseModal.find('.modal-content').append(tag);
					
					baseModal.find('.panel-body').on('click', function(event) {
					
						playRole = jQuery(event.target).attr('value');
						
						baseModal.modal('hide');
					});
					
					baseModal.on('shown.bs.modal', function() {
					
						jQuery('.panel-body').css({
						
							"background-color": "LightGrey"
						});
						
						jQuery('.panel-body').hover(
						
							function(event) {
							
								jQuery(this).css({
								
									"cursor": "pointer",
									"background-color": "Aquamarine"
								});
							},
							function(event) {
							
								jQuery(this).css({
								
									"background-color": "LightGrey"
								});
							}
						);
					});
					
					baseModal.on('hidden.bs.modal', function() {
					
						jQuery(this).remove();
						
						requirejs(["tw.ace33022.util.DateTimeUtils", "moment", "toastr", "peerjs", "firebase"], function(DateTimeUtils, moment, toastr, peerjs, firebase) {

							function onReceiveStream(stream) {
							
								// var audio = jQuery('<audio autoplay />').appendTo('body');
								
								// audio[0].onloadedmetadata = function(event) { console.log('now playing the audio'); }
								// audio[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
								
								var audio = new Audio();
								
								audio.src = (URL || webkitURL || mozURL).createObjectURL(stream);
								audio.play();
							}
		
							function showDialConfirmModal(title, confirmCallback, cancelCallback) {
							
								requirejs(["tw.ace33022.util.browser.FormUtils"], function(FormUtils) {
								
									var btnConfirmId = 'btnConfirm' + Math.random().toString(36).substr(2, 6);
									
									var baseModal, modalHeader, modalBody, modalFooter;
									
									var result = false;

									tag = '<div class="modal-body">'
											+ '  <h3 style="text-align: center;">' + title + '</h3>'
											+	'</div>';
									modalBody = jQuery(tag);
									
									tag = '<div class="modal-footer">'
											+ '  <button type="button" id="' + btnConfirmId + '" class="btn btn-primary">確認</button>'
											+ '  <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>'
											+ '</div>';
									modalFooter = jQuery(tag);
									
									baseModal = FormUtils.addBaseModal(modalHeader, modalBody, modalFooter);
									
									baseModal.find('.modal-dialog').addClass('modal-sm');
									
									baseModal.on('shown.bs.modal', function() {

										jQuery('#' +btnConfirmId).on('click', function(event) {
										
											result = true;
											
											baseModal.modal('hide');
										});
									});
									
									baseModal.on('hidden.bs.modal', function() {
									
										jQuery(this).remove();
										
										if (result == true) {
										
											if (typeof confirmCallback === 'function') confirmCallback();
										}
										else {
										
											if (typeof cancelCallback === 'function') cancelCallback();
										}
									});
									
									baseModal.modal({
									
										"backdrop": "static",
										"keyboard": false,
										"show": true
									});
								});
							};
							
							var easySuggestionButton = L.easyButton({

								states: [
									{
										"stateName": "suggestion",
										"title": "give me suggestion",
										"icon": "fa-comments",
										"onClick": function(btn, map) {
										
											requirejs(["tw.ace33022.util.browser.FormUtils"], function(FormUtils) {
											
												FormUtils.showTextareaModal({
												
													"title": "問題回報／建議事項",
													"callback": function(value) {
													
														var errorCode;
													
														FormUtils.showMarqueebar(
														
															'資料處理中‧‧‧',
															function(closeMarqueebar) {
															
																jQuery.ajax({
																
																	// "contentType": "application/json; charset=utf-8",
																	"dataType": "json",
																	"url": "https://script.google.com/macros/s/AKfycbx-VcoJNkmNvNdpUmUEPv8Yc9054NfyWOFd3qZCrqyqZ_hjDbc/exec",
																	"data": value,
																	"type": "POST",
																	"success": function(data, textStatus, jqXHR) {
																	
																		errorCode = data["error_code"];
																		
																		closeMarqueebar();
																	},
																	"error": function(jqXHR, textStatus, errorThrown) {
																	
																		closeMarqueebar();
																	}
																});
															},
															function() {
															
																if (typeof errorCode != 'undefined') {
																
																	if (errorCode === 0) {
																	
																		FormUtils.showMessage('感謝您的建議！！');
																	}
																	else {
																	
																		FormUtils.showMessage('資料處理過程有誤！');
																	}
																}
																else {
																
																	FormUtils.showMessage('資料處理過程有誤！');
																}
															}
														);
													}
												});
											});
										}
									} 
								]
							});

							/**
							 *
							 * @description easyShowAreaMarkerButton
							 *
							 * @version 2018/08/05 初始版本。
							 *
							 * @author ace
							 *
							 * @see {@link https://stackoverflow.com/questions/35772717/searching-markers-with-leaflet-control-search-from-drop-down-list|javascript - Searching markers with Leaflet.Control.Search from drop down list - Stack Overflow}
							 * @see {@link https://stackoverflow.com/questions/34322864/finding-a-specific-layer-in-a-leaflet-layergroup-where-layers-are-polygons|javascript - Finding a specific layer in a Leaflet LayerGroup where layers are polygons - Stack Overflow}
							 * @see {@link https://stackoverflow.com/questions/15755219/find-layers-in-current-map-view-with-leafletjs|gis - Find layers in current map view with Leafletjs - Stack Overflow}
							 * @see {@link https://stackoverflow.com/questions/22081680/get-a-list-of-markers-layers-within-current-map-bounds-in-leaflet/37665972|javascript - Get a list of markers/layers within current map bounds in Leaflet - Stack Overflow}
							 * @see {@link https://stackoverflow.com/questions/25372033/adding-layers-in-layer-group-dynamically-to-layer-control-in-leaflet|adding layers in layer group dynamically to layer control in leaflet - Stack Overflow}
							 *
							 * @see {@link https://github.com/stefanocudini/leaflet-search|stefanocudini/leaflet-search: Search stuff in a Leaflet map}
							 * @see {@link https://labs.easyblog.it/maps/leaflet-search/|Leaflet.Control.Search}
							 * @see {@link https://github.com/stefanocudini/leaflet-list-markers|stefanocudini/leaflet-list-markers: A Leaflet Control for listing visible markers/features in a interactive box}
							 * @see {@link https://labs.easyblog.it/maps/leaflet-list-markers/|Leaflet List Markers}
							 *
							 * @see {@link https://blogs.kent.ac.uk/websolutions/2015/01/29/filtering-map-markers-with-leaflet-js-a-brief-technical-overview/|Filtering map markers with Leaflet.js: a brief technical overview – Web Solutions}
							 *
							 * @see {@link http://jsfiddle.net/FranceImage/9xjt8223/|Dynamic Layer Groups - JSFiddle}
							 * @see {@link https://codepen.io/gvenech/pen/QEjEGg|Leaflet Example with LayerGroup}
							 *
							 * @todo 2019/03/21 ace 刷新內容方式？
							 *
							 */
							var easyShowAreaMarkerButton = L.easyButton({

								states: [
									{
										"stateName": "show-area-finder",
										"title": "show area finders",
										"icon": "fa-eye",
										"onClick": function(btn, map) {
									
											var tag;
											var baseModal, modalHeader, modalBody, modalFooter;
											
											var markerId = null;
											var arrMarkers = new Array();
											
											tag = '<div class="modal-header">'
													+ '  <h4 style="text-align: center;">上線時間</h4>'
													+ '</div>';
											modalHeader = jQuery(tag);
											
											tag = '<div class="modal-footer">'
													+ '  <input type="button" class="btn btn-primary" data-dismiss="modal" value="關閉" />'
													+ '</div>';
											modalFooter = jQuery(tag);

											tag = '<div class="modal-body">'
													+ '  <div class="panel-group"></div>'
													+ '</div>'
											modalBody = jQuery(tag);
											
											baseLayerGroup.eachLayer(function(layer) {
											
												if ((layer instanceof L.Marker) && (map.getBounds().contains(layer.getLatLng()))) {
												
													if (typeof layer["id"] !== 'undefined') arrMarkers.push(layer);
												}
											});
											
											if (arrMarkers.length !== 0) {
											
												arrMarkers.sort(function(a, b) { return DateTimeUtils.doDateTimeStringToDateTime(b["loginDate"] + b["loginTime"] + '00') - DateTimeUtils.doDateTimeStringToDateTime(a["loginDate"] + a["loginTime"] + '00'); });
												
												arrMarkers.forEach(function(element) {
												
													var tag = '<div class="panel panel-primary" style="vertical-align: middle; text-align: center;">'
																	+ '  <div class="panel-body" value="' + element["id"] + '">' + moment(DateTimeUtils.doDateTimeStringToDateTime(element["loginDate"] + element["loginTime"] + '00')).format('YYYY/MM/DD HH:mm') + '</div>'
																	+ '</div>';
													modalBody.find('.panel-group').append(tag);
												});
											
												baseModal = FormUtils.addBaseModal(modalHeader, modalBody, modalFooter);
												
												baseModal.find('.panel-body').hover(
												
													function(event) {
													
														jQuery(this).css({
														
															"cursor": "pointer",
															"background-color": "Aquamarine"
														});
													},
													function(event) {
													
														jQuery(this).css({
														
															"background-color": "White"
														});
													}
												);
												
												baseModal.on('hidden.bs.modal', function(event) {
											
													jQuery(this).remove();
													
													if (markerId !== null) {
													
														baseLayerGroup.eachLayer(function(layer) {
														
															if ((typeof layer["id"] !== 'undefined') && (layer["id"] === markerId)) layer.fire('click');
														});
													}
												});
												
												baseModal.find('.panel-body').on('click', function(event) {
												
													markerId = jQuery(event.target).attr('value');
													
													baseModal.modal('hide');
												});
												
												baseModal.modal('show');
											}
										}
									} 
								]
							});
						
							/**
							 *
							 * @description showChatModal
							 *
							 * @version 2019/03/01 初始版本。
							 *
							 * @author ace
							 *
							 * @see {@link https://api.jquery.com/scrollTop/|.scrollTop() | jQuery API Documentation}
							 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Element/scrollTop|Element.scrollTop - Web APIs | MDN}
							 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/Element/scrollHeight|Element.scrollHeight - Web APIs | MDN}
							 *
							 */			
							function showChatModal() {
							
								var inpMessageId = 'inpMessage' + Math.random().toString(36).substr(2, 6);
								var btnSendMessageId = 'btnSendMessage' + Math.random().toString(36).substr(2, 6);

								var tag;

								var conn = null;
								
								if (arguments.length !== 0) {
								
									if (typeof arguments[0]["conn"] !== 'undefined') conn = arguments[0]["conn"];
									
									tag = '<div id="' + chatModalId + '" class="row">'
											+ '  <div class="chatbox">'
											
											+ '    <div class="chatbox__title">'
											+ '      <h5>對話視窗</h5>'
											+ '      <button class="chatbox__title__close">'
											+ '        <span>'
											+ '          <svg viewBox="0 0 12 12" width="12px" height="12px">'
											+ '            <line stroke="#FFFFFF" x1="11.75" y1="0.25" x2="0.25" y2="11.75"></line>'
											+ '            <line stroke="#FFFFFF" x1="11.75" y1="11.75" x2="0.25" y2="0.25"></line>'
											+ '          </svg>'
											+ '        </span>'
											+ '      </button>'
											+ '    </div>'
											
											+ '    <div class="chatbox__body" style="overflow-y: auto;"></div>'
											
											+ '    <div class="panel-footer">'
											+ '      <div class="input-group">'
											+ '        <input type="text" id="' + inpMessageId + '" class="form-control" placeholder="Type message here..." tabindex="0" dir="ltr" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" contenteditable="true" />'
											+ '        <span class="input-group-btn">'
											+ '          <button id="' + btnSendMessageId + '" class="btn btn-primary">送出</button>'
											+ '        </span>'
											+ '      </div>'
											+ '    </div>'
											+ '  </div>'
											+ '</div>';
									jQuery(jQuery('.container-fluid')[0]).append(tag);
									
									jQuery('.chatbox__title').on('click', function(event) {
									
										jQuery('.chatbox').toggleClass('chatbox--tray');
										
										if (!jQuery('.chatbox').hasClass('chatbox--tray')) jQuery('#' + inpMessageId).focus();
									});
									
									jQuery('.chatbox__title__close').on('click', function(event) {
									
										event.stopPropagation();
										
										FormUtils.showConfirmMessage(
										
											'關閉對話視窗將會切斷連線，請確認？',
											function() {
											
												jQuery('#' + chatModalId).remove();
												
												if (conn != null) conn.close();
											}
										);
									});
									
									jQuery('#' + btnSendMessageId).on('click', function(event) {
									
										var now = new Date();
										
										var tag;
									
										if (jQuery('#' + inpMessageId).val() !== '') {
										
											conn.send(JSON.stringify({"returnCode": 0, "message": jQuery('#' + inpMessageId).val()}));
											
											tag = '      <div class="chatbox__body__message chatbox__body__message--right">'
													+ '        <div class="chatbox_timing">'
													+ '          <ul>'
													+ '            <li><i class="fa fa-calendar"></i>' + moment(now).format(Configurations["ShowDateFormatString"]) + '</li>'
													+ '            <li><i class="fa fa-clock-o"></i>' + moment(now).format(Configurations["ShowTimeFormatString"]) + '</li>'
													+ '          </ul>'
													+ '        </div>'
													+ '        <img src="images/Original-Facebook-Geek-Profile-Avatar-1.jpg" alt="Picture">'
													+ '        <div class="ul_section_full">'
													+ '          <ul class="ul_msg">'
													+ '            <li>' + jQuery('#' + inpMessageId).val() + '</li>'
													+ '          </ul>'
													+ '        </div>'
													+ '      </div>';
											jQuery('.chatbox__body').append(tag);
											
											(new Audio('sounds/unsure.mp3')).play();
											
											jQuery('.chatbox__body').scrollTop(jQuery('.chatbox__body')[0].scrollHeight);
										}
										
										jQuery('#' + inpMessageId).val('');
										jQuery('#' + inpMessageId).focus();
									});
									
									jQuery('#' + inpMessageId).focus();
									
									if (typeof arguments[0]["message"] !== 'undefined') {
									
										jQuery('#' + inpMessageId).val(arguments[0]["message"]);
										jQuery('#' + btnSendMessageId).trigger('click');
									}
								}
							}
							
							/**
							 *
							 * @version 2019/03/19 初始版本。
							 *
							 * @author ace
							 *
							 * @see {@link https://notificationsounds.com/|Free ringtones, alerts, and other sounds for your mobile phone | Notification Sounds}
							 * @see {@link https://notificationsounds.com/notification-sounds|Notification Sounds - free downloads | Notification Sounds}
							 * @see {@link https://notificationsounds.com/notification-sounds/unsure-566|Unsure - free mp3 and m4r download | Notification Sounds}
							 * @see {@link https://notificationsounds.com/message-tones/to-the-point-568|To the point - free mp3 and m4r download | Notification Sounds}
							 *
							 * @see {@link http://www.orangefreesounds.com/|Free Sound Effects, Music, Loops | Orange Free Sounds}
							 * @see {@link http://www.orangefreesounds.com/category/sound-effects/notification-sounds/|Notification Sounds | Orange Free Sounds}
							 *
							 */
							function appendOppositeMessage(message) {
							
								var now = new Date();
								
								var tag;
								
								if (message !== '') {
								
									tag = '      <div class="chatbox__body__message chatbox__body__message--left">'
											+ '        <div class="chatbox_timing">'
											+ '          <ul>'
											+ '            <li><i class="fa fa-calendar"></i>' + moment(now).format(Configurations["ShowDateFormatString"]) + '</li>'
											+ '            <li><i class="fa fa-clock-o"></i>' + moment(now).format(Configurations["ShowTimeFormatString"]) + '</li>'
											+ '          </ul>'
											+ '        </div>'
											+ '        <img src="images/Original-Facebook-Geek-Profile-Avatar-1.jpg" alt="Picture">'
											+ '        <div class="ul_section_full">'
											+ '          <ul class="ul_msg">'
											+ '            <li>' + message + '</li>'
											+ '          </ul>'
											+ '        </div>'
											+ '      </div>';
									jQuery('.chatbox__body').append(tag);
									
									(new Audio('sounds/unsure.mp3')).play();
									
									jQuery('.chatbox__body').scrollTop(jQuery('.chatbox__body')[0].scrollHeight);
								}
							}
							
							var loginDateTime = new Date();
							
							var chatModalId = 'chatModal' + Math.random().toString(36).substr(2, 6);
							
							var marker = null, markerOptions = {};
							
							var baseLayerGroup = new L.layerGroup();
							var rtcLayerGroup = new L.layerGroup();
							
							var peer;
							
							var loginError = false;
							
							// 這個寫法只有在轉換瀏覽器的Tab時才有作用，轉換不同程式時則無用！？
							document.addEventListener('visibilitychange',

								function() {

									// if (!document.hidden) initInsertStatus(false);
									// console.log(document.visibilityState);
								},
								false
							);
							
							jQuery(window).on('focus', function(event) {
							
								if (jQuery('body').hasClass('modal-open') === false) {
								
									if (jQuery('#' + chatModalId).length !== 0) jQuery('#' + chatModalId).find('input').focus();
								}
							});
							
							jQuery(window).on('blur', function(event) {
							
								// @todo 2019/03/22 ace 是否控制音效？
							});
							
							FormUtils.showMarqueebar(
							
								'資料處理中，請稍候‧‧‧',
								function(closeMarqueebar) {
								
									firebase.initializeApp({

										"apiKey": "AIzaSyBg5LJIDwF99Pg3JcwSvXKZT72XeW868N8",
										"authDomain": "activitymap.firebaseapp.com",
										"databaseURL": "https://activitymap.firebaseio.com",
										"projectId": "firebase-activitymap",
										"storageBucket": "firebase-activitymap.appspot.com",
										"messagingSenderId": "749991636936"
									});
							
									/*
									peer = new Peer(null, {
										
										"debug": 2,
										"config": {
										
											"iceServers": [
											
												{"url": "stun:stun1.l.google.com:19302"},
												{"url": "stun:stun2.l.google.com:19302"},
												{"url": "stun:stun3.l.google.com:19302"},
												{"url": "stun:stun4.l.google.com:19302"},
												{
													"url": "turn:numb.viagenie.ca",
													"credential": "muazkh",
													"username": "webrtc@live.com"
												},
												{
													"url": "turn:192.158.29.39:3478?transport=udp",
													"credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
													"username": "28224511:1379330808"
												},
												{
													"url": "turn:192.158.29.39:3478?transport=tcp",
													"credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
													"username": "28224511:1379330808"
												}
											]
										}
									});
									*/
									
									peer = new Peer(null, {
										
										"debug": 2,
										"secure": false
									});
									
									peer.on('disconnected', function() { 
									
										peer.reconnect();
										
										toastr.error('後臺主機連線中斷，將重新進行連線！');
									});
									
									peer.on('close', function() {
									
										if (jQuery('body').hasClass('modal-open') === false) {
										
											FormUtils.showMessage(
											
												'後臺主機關閉連線關閉！',
												function() { location.reload(true); }
											);
										}
										else {
										
											toastr.error('後臺主機關閉連線！');
										}
									});

									peer.on('error', function(error) { toastr.error('後臺主機連線出現錯誤：'  + error); });
									
									if (playRole == 0) {
									
										peer.on('open', function(peerId) {
										
											var now = new Date();
										
											var saveData = {

												"loginDate": moment(now).format(Configurations["SaveDateFormatString"]),
												"loginTime": moment(now).format(Configurations["SaveTimeFormatString"]),
												"showOnBase": true,
												"position": {
												
													"latitude": position.coords.latitude, 
													"longitude": position.coords.longitude
												}
											};
											
											if (peerId != null) {
											
												easySuggestionButton.addTo(map);
												
												map.addLayer(rtcLayerGroup);
									
												firebase.database().ref('fvs/finders/' + peerId).set(saveData, function(error) {
												
													if (error != null) {
													
														loginError = true;
														
														closeMarqueebar();
													}
													else {

														window.addEventListener('beforeunload', function(event) {
														
															firebase.database().ref('fvs/finders/' + peerId).remove();
														});
														
														peer.on('connection', function(c) {

															var conn = null;
															var call = null;
															
															var peerMarkerOptions = {
														
																"icon": L.icon({"iconUrl": "images/automobile.png", "iconSize": [36, 36]})
															};
															
															var peerMarker = null;
															
															var returnCode;
															
															// Allow only a single connection
															if (conn) {
															
																c.on('open', function() {
																
																	var sendData = {
																	
																		"returnCode": 1,
																		"message": "Already connected to another client."
																	};
																	
																	conn.send(JSON.stringify(sendData));
																	
																	setTimeout(function() { c.close(); }, 500);
																});
															}
															else {
															
																firebase.database().ref('fvs/finders/' + peerId + '/showOnBase').set(false, function(error) {
																
																	var audioHelium = setInterval(function() { (new Audio('sounds/helium.mp3')).play(); }, 4500);
																	
																	conn = c;
																
																	if (error != null) {
																	
																		toastr.warning('資料處理過程有誤！錯誤訊息：' + error);
																	}
																	else {

																		peer.on('call', function(remoteCall) {
																		
																			call = remoteCall;
																		
																			call.on('stream', onReceiveStream);
																			
																			call.on('close', function(event) {});

																			call.on('error', function(error) { toastr.error('通訊過程有誤，錯誤訊息：' + error); });
																			
																			window.navigator.getUserMedia(
																			
																				{
																					"video": false,
																					"audio": true
																				},
																				function(localMediaStream) {

																					call.answer(localMediaStream);
																				},
																				function(error) {
																				
																					var sendData = {
																					
																						"returnCode": 8
																					};
																					
																					if (error.name === 'PermissionDeniedError') {
																					
																						toastr.error('沒有開放媒體設備權限，無法進行語音通話！');
																					}
																					else {
																					
																						toastr.error('取得媒體設備發生錯誤，錯誤訊息：' + error.name);
																					}
																					
																					if (conn != null) {
																					
																						conn.send(JSON.stringify(sendData));
																					}
																				}
																			);
																		});
																	
																		conn.on('data', function(data) {
																		
																			returnCode = (JSON.parse(data))["returnCode"];
																			
																			if (returnCode === 0) {

																				if (peerMarker == null) {
																				
																					if (typeof (JSON.parse(data))["peerLatLng"] !== 'undefined') {
																					
																						peerMarker = new L.marker([(JSON.parse(data))["peerLatLng"]["latitude"], (JSON.parse(data))["peerLatLng"]["longitude"]], peerMarkerOptions);
																						
																						peerMarker.addTo(rtcLayerGroup);
																					}
																				}
																				
																				if (typeof (JSON.parse(data))["peerLatLng"] !== 'undefined') peerMarker.setLatLng(L.latLng((JSON.parse(data))["peerLatLng"]["latitude"], (JSON.parse(data))["peerLatLng"]["longitude"]));
																				
																				if (typeof (JSON.parse(data))["message"] !== 'undefined') appendOppositeMessage((JSON.parse(data))["message"]);
																			}
																			else if (returnCode === 8) {
																			
																				toastr.warning('對方未提供語音通訊！');
																			}
																			else if (returnCode === 9) {
																			
																				// 選擇接受來訊前，對方傳送的切斷訊息代碼。
																				confirmModal.modal('hide');
																				
																				toastr.warning('對方取消連線');
																				
																				window.navigator.geolocation.getCurrentPosition(
																				
																					function(position) {
																					
																						saveData["showOnBase"] = true;
																						
																						saveData["position"] = {
																						
																							"latitude": position.coords.latitude, 
																							"longitude": position.coords.longitude
																						};
																						
																						if (selfDebug === 1) {
																					
																							saveData["position"] = {
																								
																								"latitude": marker.getLatLng()["lat"],
																								"longitude": marker.getLatLng()["lng"]
																							};
																						}
																					
																						firebase.database().ref('fvs/finders/' + peerId).set(saveData, function(error) {
																						
																							if (error != null) {
																							
																								FormUtils.showMessage(
																								
																									'資料處理過程有誤！',
																									function() { location.reload(true); }
																								);
																							}
																						});
																					},
																					function(error) {
																					
																						FormUtils.showMessage(
																						
																							'重新取得地理位置過程有誤！',
																							function() { location.reload(true); }
																						);
																					}
																				);
																			}
																		});
																		
																		conn.on('close', function() {
																		
																			if (jQuery('#' + chatModalId).length !== 0) {
																			
																				if (call != null) call.close();
																			
																				toastr.warning('連線中斷！');
																				
																				jQuery('#' + chatModalId).remove();
																			}
																			
																			rtcLayerGroup.eachLayer(function(layer) {
																			
																				if (layer == peerMarker) rtcLayerGroup.removeLayer(layer); 
																			});
																			
																			window.navigator.geolocation.getCurrentPosition(
																			
																				function(position) {
																				
																					saveData["showOnBase"] = true;
																					
																					saveData["position"] = {
																						
																						"latitude": position.coords.latitude, 
																						"longitude": position.coords.longitude
																					};
																					
																					if (selfDebug === 1) {
																				
																						saveData["position"] = {
																							
																							"latitude": marker.getLatLng()["lat"],
																							"longitude": marker.getLatLng()["lng"]
																						};
																					}

																					// @todo 2019/04/09 ace 取消連接後的座標顯示速度很慢？！
																					firebase.database().ref('fvs/finders/' + peerId).set(saveData, function(error) {
																					
																						if (error != null) {
																						
																							FormUtils.showMessage(
																							
																								'資料處理過程有誤！',
																								function() { location.reload(true); }
																							);
																						}
																					});
																				},
																				function(error) {
																				
																					FormUtils.showMessage(
																					
																						'重新取得地理位置過程有誤！',
																						function() { location.reload(true); }
																					);
																				}
																			);
																			
																			conn = null;
																		});
																		
																		conn.on('error', function(error) { 
																		
																			toastr.warning(error);
																			
																			window.navigator.geolocation.getCurrentPosition(
																			
																				function(position) {
																				
																					saveData["showOnBase"] = true;
																					
																					saveData["position"] = {
																						
																						"latitude": position.coords.latitude, 
																						"longitude": position.coords.longitude
																					};
																					
																					if (selfDebug === 1) {
																				
																						saveData["position"] = {
																							
																							"latitude": marker.getLatLng()["lat"],
																							"longitude": marker.getLatLng()["lng"]
																						};
																					}
																				
																					firebase.database().ref('fvs/finders/' + peerId).set(saveData, function(error) {
																					
																						if (error != null) {
																						
																							FormUtils.showMessage(
																							
																								'資料處理過程有誤！',
																								function() { location.reload(true); }
																							);
																						}
																					});
																				},
																				function(error) {
																				
																					FormUtils.showMessage(
																					
																						'重新取得地理位置過程有誤！',
																						function() { location.reload(true); }
																					);
																				}
																			);
																		});
																		
																		showDialConfirmModal(
																		
																			'是否接通？',
																			function() {
																			
																				var sendData = {
																				
																					"returnCode": 0,
																					"peerLatLng": {
																					
																						"latitude": marker.getLatLng()["lat"],
																						"longitude": marker.getLatLng()["lng"]
																					}
																				};

																				clearInterval(audioHelium);
																				
																				marker.on('dragend', function(event) {
																		
																					sendData["peerLatLng"] = {
																					
																						"latitude": marker.getLatLng()["lat"],
																						"longitude": marker.getLatLng()["lng"]
																					};
																				
																					map.setView([marker.getLatLng()["lat"], marker.getLatLng()["lng"]], 16);
																					
																					conn.send(JSON.stringify(sendData));
																				});
																				
																				window.navigator.geolocation.watchPosition(
																					
																					function(position) {
																					
																						var sendData = {
																						
																							"returnCode": 0,
																							"peerLatLng": {
																							
																								"latitude": position.coords.latitude, 
																								"longitude": position.coords.longitude
																							}
																						};
																						
																						if (selfDebug === 0) {
																						
																							if (conn != null) conn.send(JSON.stringify(sendData));
																						}
																					},
																					function(error) {
																					
																						// console.log(error);
																					}
																				);
																				
																				conn.send(JSON.stringify(sendData));
																				
																				showChatModal({
																				
																					"conn": conn
																				});
																			},
																			function() {
																			
																				clearInterval(audioHelium);
																			
																				conn.send(JSON.stringify({"returnCode": 9}));
																				
																				conn = null;
																				
																				window.navigator.geolocation.getCurrentPosition(
																				
																					function(position) {
																					
																						saveData["showOnBase"] = true;
																						
																						saveData["position"] = {
																							
																							"latitude": position.coords.latitude, 
																							"longitude": position.coords.longitude
																						};
																						
																						if (selfDebug === 1) {
																					
																							saveData["position"] = {
																								
																								"latitude": marker.getLatLng()["lat"],
																								"longitude": marker.getLatLng()["lng"]
																							};
																						}
																					
																						firebase.database().ref('fvs/finders/' + peerId).set(saveData, function(error) {
																						
																							if (error != null) {
																							
																								FormUtils.showMessage(
																								
																									'資料處理過程有誤！',
																									function() { location.reload(true); }
																								);
																							}
																						});
																					},
																					function(error) {
																					
																						FormUtils.showMessage(
																						
																							'重新取得地理位置過程有誤！',
																							function() { location.reload(true); }
																						);
																					}
																				);
																			}
																		);
																	}
																});
															}
														});
														
														if (selfDebug === 1) {
														
															markerOptions["icon"] = L.divIcon({"iconSize": [24, 24], "className": "leaflet-div-icon-finder"});
															markerOptions["draggable"] = true;
														}
														
														marker = new L.marker([position.coords.latitude, position.coords.longitude], markerOptions);
														
														marker.on('dragend', function(event) {
														
															map.setView([marker.getLatLng()["lat"], marker.getLatLng()["lng"]], 16);
															
															firebase.database().ref('fvs/finders/' + peerId + '/position').set({"latitude": marker.getLatLng()["lat"], "longitude": marker.getLatLng()["lng"]}, function(error) { if (error != null) console.log(error); });
														});
															
														window.navigator.geolocation.watchPosition(
															
															function(position) {
															
																if (selfDebug === 0) {
																
																	marker.setLatLng(L.latLng(position.coords.latitude, position.coords.longitude));
																	
																	firebase.database().ref('fvs/finders/' + peerId).set({ "latitude": position.coords.latitude, "longitude": position.coords.longitude }, function(error) { console.log(error); });
																}
															},
															function(error) {
															}
														);
													
														marker.addTo(rtcLayerGroup);
														
														closeMarqueebar();
													}
												});
											} 
											else {
											
												loginError = true;
												
												closeMarqueebar();
											}
										});
									}
									else if (playRole == 1) {
									
										peer.on('open', function(peerId) {
							
											function dialModal(title, showCallback, closeCallback) {
											
												requirejs(["tw.ace33022.util.browser.FormUtils"], function(FormUtils) {
												
													var baseModal, modalHeader, modalBody, modalFooter;

													tag = '<div class="modal-header">'
															+ '  <h3 class="modal-title">' + title + '</h3>'
															+ '</div>';
													modalHeader = jQuery(tag);

													tag = '<div class="modal-body">'
															+ '  <div class="progress progress-striped active" style="margin-bottom: 0px;">'
															+ '    <div class="progress-bar" style="width: 100%;"></div>'
															+ '  </div>'
															+	'</div>';
													modalBody = jQuery(tag);
													
													tag = '<div class="modal-footer">'
															+ '  <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>'
															+ '</div>';
													modalFooter = jQuery(tag);
													
													baseModal = FormUtils.addBaseModal(modalHeader, modalBody, modalFooter);
													
													baseModal.on('shown.bs.modal', function() {

														if (typeof showCallback === 'function') showCallback(function() { setTimeout(function() { baseModal.modal('hide'); }, 200); });
													});
													
													baseModal.on('hidden.bs.modal', function() {
													
														jQuery(this).remove();
														
														if (typeof closeCallback === 'function') closeCallback();
													});
													
													baseModal.modal({
													
														"backdrop": "static",
														"keyboard": false,
														"show": true
													});
												});
											};
													
											function markerClickEvent(event) {
											
												var customMarker = event.sourceTarget;
												
												var tag = '<div id="' + event["target"]["id"] + '" class="panel-group">'
																+ '  <div class="panel panel-primary" style="vertical-align: middle; text-align: center;">'
																+ '    <div class="panel-body" value="0">連線</div>'
																+ '	 </div>'
																+ '</div>';
												customMarker.bindPopup(tag);
												customMarker.openPopup();
												
												jQuery('#' + customMarker["id"]).find('.panel-body').hover(
												
													function(event) {
													
														jQuery(this).css({
														
															"cursor": "pointer",
															"background-color": "Aquamarine"
														});
													},
													function(event) {
													
														jQuery(this).css({
														
															"background-color": "White"
														});
													}
												);
													
												jQuery('#' + event["target"]["id"]).find('.panel-body').on('click', function(event) {
											
													var peerMarkerOptions = {
													
														"icon": L.divIcon({"iconSize": L.point(25, 25), "className": "leaflet-div-icon-finder"})
													};
												
													var peerMarker = null;

													var returnCode;
												
													var conn = null;
													var call = null;
													
													customMarker.closePopup();
													
													// peerMarker = new L.marker(customMarker.getLatLng(), peerMarkerOptions);
													peerMarker = new L.marker(customMarker.getLatLng());
													
													peerMarker["id"] = customMarker["id"];
													peerMarker["loginDate"] = customMarker["loginDate"];
													peerMarker["loginTime"] = customMarker["loginTime"];
													
													peerMarker.addTo(rtcLayerGroup);
													
													map.removeLayer(baseLayerGroup);
													map.addLayer(rtcLayerGroup);
											
													easyShowAreaMarkerButton.removeFrom(map);
													easySuggestionButton.removeFrom(map);
											
													easySuggestionButton.addTo(map);

													dialModal(
													
														'連線中‧‧‧',
														function(closeMarqueebar) {
														
															conn = peer.connect(customMarker["id"], {
															
																"reliable": true
															});
															
															// Handle incoming data (messages only since this is the signal sender)
															conn.on('data', function(data) {
															
																var sendData = {
																
																	"returnCode": 0
																};
																
																returnCode = (JSON.parse(data))["returnCode"];
																
																if (jQuery('#' + chatModalId).length === 0) {
																
																	if (returnCode === 0) {

																		marker.on('dragend', function(event) {
																		
																			var sendData = {
																			
																				"returnCode": 0,
																				"peerLatLng": {
																				
																					"latitude": marker.getLatLng()["lat"],
																					"longitude": marker.getLatLng()["lng"]
																				}
																			};
																
																			if (conn != null) conn.send(JSON.stringify(sendData));
																		});
																		
																		window.navigator.geolocation.watchPosition(
																			
																			function(position) {
																			
																				var sendData = {
																				
																					"returnCode": 0,
																					"peerLatLng": {
																					
																						"latitude": position.coords.latitude, 
																						"longitude": position.coords.longitude
																					}
																				};
																				
																				if (selfDebug === 0) {
																				
																					if (conn != null) conn.send(JSON.stringify(sendData));
																				}
																			},
																			function(error) {
																			
																				// console.log(error);
																			}
																		);

																		sendData["peerLatLng"] = {
																		
																			"latitude": marker.getLatLng()["lat"],
																			"longitude": marker.getLatLng()["lng"]
																		};
																		
																		conn.send(JSON.stringify(sendData));
																		
																		showChatModal({
																		
																			"conn": conn,
																			"message": "您好，要搭計程車嗎？"
																		});
																		
																		window.navigator.getUserMedia(
																		
																			{
																				"video": false,
																				"audio": true
																			},
																			function(localMediaStream) {
																			
																				call = peer.call(customMarker["id"], localMediaStream);

																				call.on('stream', onReceiveStream);
																				
																				call.on('error', function(error) { toastr.error('通訊過程有誤，錯誤訊息：' + error); });
																			},
																			function(error) {
																			
																				sendData["returnCode"] = 8;
																				
																				conn.send(JSON.stringify(sendData));
																				
																				if (error.name === 'PermissionDeniedError') {
																				
																					toastr.warning('沒有開放媒體設備權限，無法進行語音通話！');
																				}
																				else {
																				
																					toastr.error('取得媒體設備發生錯誤，錯誤訊息：' + error.name);
																				}
																			}
																		);
																	}
																	
																	closeMarqueebar();
																}
																else {
																
																	if (returnCode === 0) {

																		if (typeof (JSON.parse(data))["message"] !== 'undefined') appendOppositeMessage((JSON.parse(data))["message"]);
																		
																		if ((typeof (JSON.parse(data))["peerLatLng"] !== 'undefined')) peerMarker.setLatLng(L.latLng((JSON.parse(data))["peerLatLng"]["latitude"], (JSON.parse(data))["peerLatLng"]["longitude"]));
																	}
																	else if (returnCode === 8) {
																	
																		toastr.warning('對方未提供語音通訊！');
																	}
																}
															});
															
															conn.on('close', function() {
															
																map.eachLayer(function(layer) {
													
																	if ((layer instanceof L.LayerGroup) && (layer == rtcLayerGroup)) {
																	
																		if (call != null) call.close();
																	
																		toastr.warning('連線中斷！');
																		
																		rtcLayerGroup.eachLayer(function(layer) {
																		
																			if (typeof layer["id"] !== 'undefined') rtcLayerGroup.removeLayer(layer); 
																		});
																		
																		jQuery('#' + chatModalId).remove();
																		
																		map.removeLayer(rtcLayerGroup);
																		map.addLayer(baseLayerGroup);
																		
																		easyShowAreaMarkerButton.removeFrom(map);
																		easySuggestionButton.removeFrom(map);
																		
																		easyShowAreaMarkerButton.addTo(map);
																		easySuggestionButton.addTo(map);
																		
																		conn = null;
																	}
																});
																
																closeMarqueebar();
															});
																
															conn.on('error', function(error) { 
															
																toastr.warning('連線發生錯誤，錯誤訊息：' + error);
																
																map.eachLayer(function(layer) {
													
																	if ((layer instanceof L.LayerGroup) && (layer == rtcLayerGroup)) {
																	
																		rtcLayerGroup.eachLayer(function(layer) {
																		
																			if (typeof layer["id"] !== 'undefined') rtcLayerGroup.removeLayer(layer); 
																		});
																		
																		jQuery('#' + chatModalId).remove();
																		
																		map.removeLayer(rtcLayerGroup);
																		map.addLayer(baseLayerGroup);
																		
																		easyShowAreaMarkerButton.removeFrom(map);
																		easySuggestionButton.removeFrom(map);
																		
																		easyShowAreaMarkerButton.addTo(map);
																		easySuggestionButton.addTo(map);
																		
																		conn = null;
																	}
																});
																
																closeMarqueebar();
															});
														},
														function() {
														
															if (typeof returnCode === 'undefined') {
															
																// 自己取消連線。
																conn.send(JSON.stringify({"returnCode": 9}));
																
																rtcLayerGroup.eachLayer(function(layer) {
																
																	if (typeof layer["id"] !== 'undefined') rtcLayerGroup.removeLayer(layer); 
																});
																
																map.removeLayer(rtcLayerGroup);
																map.addLayer(baseLayerGroup);
																
																easyShowAreaMarkerButton.removeFrom(map);
																easySuggestionButton.removeFrom(map);
																
																easyShowAreaMarkerButton.addTo(map);
																easySuggestionButton.addTo(map);
															}
															else if (returnCode === 9) {
															
																// 對方取消連線。
																rtcLayerGroup.eachLayer(function(layer) {
																
																	if (typeof layer["id"] !== 'undefined') rtcLayerGroup.removeLayer(layer); 
																});
																
																map.removeLayer(rtcLayerGroup);
																map.addLayer(baseLayerGroup);
																
																easyShowAreaMarkerButton.removeFrom(map);
																easySuggestionButton.removeFrom(map);
																
																easyShowAreaMarkerButton.addTo(map);
																easySuggestionButton.addTo(map);
																
																toastr.warning('對方取消連線');
															}
														}
													);
												});
											}
												
											var customMarkerOptions = {
											
												// "icon": L.divIcon({"iconSize": [24, 24], "className": "leaflet-div-icon-finder"})
												"icon": L.divIcon({"iconSize": [24, 24]})
											};

											if (peerId != null) {
											
												markerOptions["icon"] = L.icon({"iconUrl": "images/automobile.png", "iconSize": [36, 36]});
												
												if (selfDebug === 1) {
												
													// @comment 2019/03/19 ace DivIcon物件才可以進行Drag動作？！
													// @comment 2019/03/19 ace DivIcon的背景色如何透明化？
													
													// markerOptions["icon"] = L.divIcon({"iconSize": [28, 28], "html": '<i class="fa fa-taxi fa-2x"></i>'});
													// markerOptions["icon"] = L.divIcon({"iconSize": [24, 24], "html": '<img src="images/automobile.png" style="width: 24px; height: 24px;" />'});
													
													markerOptions["icon"] = L.divIcon({"iconSize": [24, 24], "className": "leaflet-div-icon-taxi"});
													markerOptions["draggable"] = true;
												}
												
												marker = new L.marker([position.coords.latitude, position.coords.longitude], markerOptions);
												
												marker.on('dragend', function(event) {
										
													map.setView([marker.getLatLng()["lat"], marker.getLatLng()["lng"]], 16);
												});
													
												window.navigator.geolocation.watchPosition(
													
													function(position) {
													
														if (selfDebug === 0) {
														
															marker.setLatLng(L.latLng(position.coords.latitude, position.coords.longitude));
															
															map.setView([marker.getLatLng()["lat"], marker.getLatLng()["lng"]], 16);
														}
													},
													function(error) {
													
														// console.log(error);
													}
												);
												
												marker.addTo(baseLayerGroup);
												marker.addTo(rtcLayerGroup);
												
												easyShowAreaMarkerButton.addTo(map);
												easySuggestionButton.addTo(map);
												
												map.addLayer(baseLayerGroup);
												
												firebase.database().ref('fvs/finders').on('child_added', function(snapshot, prevChildKey) {
												
													// var customMarker = new L.marker([snapshot.val()["position"]["latitude"], snapshot.val()["position"]["longitude"]], customMarkerOptions);
													var customMarker = new L.marker([snapshot.val()["position"]["latitude"], snapshot.val()["position"]["longitude"]]);
													
													customMarker["id"] = snapshot.key;
													customMarker["loginDate"] = snapshot.val()["loginDate"];
													customMarker["loginTime"] = snapshot.val()["loginTime"];
													
													customMarker.on('click', markerClickEvent);
													
													customMarker.addTo(baseLayerGroup);
													
													/**
													 *
													 * @description Find Vehicle Service
													 *
													 * @version 2018/08/23 初始版本。
													 *
													 * @author ace
													 *
													 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/notification|Notification - Web APIs | MDN}
													 * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/API/notification|Notification - Web APIs | MDN}
													 * @see {@link https://developers.google.com/web/fundamentals/codelabs/push-notifications/|向網絡應用添加推送通知  |  Web  |  Google Developers}
													 * @see {@link https://cythilya.github.io/2017/07/09/notification/|Notification（通知）：利用 JavaScript 實作瀏覽器推播通知 | Summer。桑莫。夏天}
													 *
													 * @see {@link https://codeseven.github.io/toastr/|Toastr by CodeSeven}
													 * @see {@link https://github.com/CodeSeven/toastr|CodeSeven/toastr: Simple javascript toast notifications}
													 * @see {@link https://codeseven.github.io/toastr/demo.html|toastr examples}
													 * @see {@link https://cdnjs.com/libraries/toastr.js|toastr.js - cdnjs.com - The best FOSS CDN for web related libraries to speed up your websites!}
													 *
													 * @see {@link https://notificationsounds.com/|Free ringtones, alerts, and other sounds for your mobile phone | Notification Sounds}
													 * @see {@link https://notificationsounds.com/notification-sounds|Notification Sounds - free downloads | Notification Sounds}
													 * @see {@link https://notificationsounds.com/notification-sounds/unsure-566|Unsure - free mp3 and m4r download | Notification Sounds}
													 * @see {@link https://notificationsounds.com/message-tones/to-the-point-568|To the point - free mp3 and m4r download | Notification Sounds}
													 * @see {@link https://notificationsounds.com/standard-ringtones/helium-31|Helium - free mp3 and m4r download | Notification Sounds}
													 *
													 * @see {@link http://www.orangefreesounds.com/|Free Sound Effects, Music, Loops | Orange Free Sounds}
													 * @see {@link http://www.orangefreesounds.com/category/sound-effects/notification-sounds/|Notification Sounds | Orange Free Sounds}
													 *
													 */
													if (moment(DateTimeUtils.doDateTimeStringToDateTime(customMarker["loginDate"] + customMarker["loginTime"] + '00')) > loginDateTime) {
													
														if (map.getBounds().contains(customMarker.getLatLng())) {
														
															map.eachLayer(function(layer) {
															
																if ((layer instanceof L.LayerGroup) && (baseLayerGroup == layer)) {
																
																	toastr.options.onclick = function() { customMarker.fire('click'); }
																	
																	toastr.success('有人要搭計程車囉！');
																	
																	(new Audio('sounds/to-the-point.mp3')).play();
																}
															});
														}
													}	
												});
												
												firebase.database().ref('fvs/finders').on('child_changed', function(snapshot) {

													baseLayerGroup.eachLayer(function(layer) {
													
														var finder = null;
														
														var customMarker = new L.marker([snapshot.val()["position"]["latitude"], snapshot.val()["position"]["longitude"]]);
														
														if (snapshot.key == layer["id"]) finder = layer;
														
														if (finder !== null) {
														
															if (snapshot.val()["showOnBase"] == true) {
															
																layer.setLatLng(L.latLng(snapshot.val()["position"]["latitude"], snapshot.val()["position"]["longitude"]));
															}
															else {
															
																baseLayerGroup.removeLayer(layer);
															}
														}
														else {
														
															if (snapshot.val()["showOnBase"] == true) {
															
																customMarker["id"] = snapshot.key;
																customMarker["loginDate"] = snapshot.val()["loginDate"];
																customMarker["loginTime"] = snapshot.val()["loginTime"];
																
																customMarker.on('click', markerClickEvent);
																
																customMarker.addTo(baseLayerGroup);
															}
														}
													});
												});
										
												firebase.database().ref('fvs/finders').on('child_removed', function(snapshot) {

													baseLayerGroup.eachLayer(function(layer) {
													
														if (snapshot.key == layer["id"]) baseLayerGroup.removeLayer(layer);
													});
												});
												
												closeMarqueebar();
											}
											else {
											
												loginError = true;
												
												closeMarqueebar();
											}
										});
									}
								},
								function() {
								
									if (loginError == true) {
									
										/*
										 *
										 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/reload|Location.reload() - Web APIs | MDN}
										 * @see {@link https://www.w3schools.com/jsref/met_loc_reload.asp|Location reload() Method}
										 * @see {@link https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript|How to reload a page using JavaScript - Stack Overflow}
										 *
										 */
										FormUtils.showMessage(
										
											'資料處理過程有誤！',
											function() { location.reload(true); }
										);
									}
								}
							);
						});
					});
					
					baseModal.modal({
					
						"backdrop": "static",
						"keyboard": false
					});
				},
				function(error) {
				
					// console.log(error.message);
					
					if (error.code === 1) {
					
						// @todo 2019/03/13 ace 改成顯示無法關閉的視窗。
						FormUtils.showMessage(
						
							'必須允許地理定位功能才能繼續執行程式！',
							function() { location.reload(true); }
						);
					}
					else if (error.code === 2) {
					
						// @todo 2019/03/13 ace 改成顯示無法關閉的視窗。
						FormUtils.showMessage(
						
							'地理定位資料功能有誤！',
							function() { location.reload(true); }
						);
					}
					else if (error.code === 3) {
					
						FormUtils.showMessage(
						
							'取得地理定位資料過久，請重新載入網頁！',
							function() { location.reload(true); }
						);
					}
				}
			);
		}
	});
});