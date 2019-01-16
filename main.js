(function(){
    'use strict';
    /**
     * playlist
     */
    var playList = [
			{
				url: 'https://t.bwzybf.com/2018/11/29/uPBoZ55x2QNMy84G/playlist.m3u8'
			},
			{	
				url: 'http://10.2.68.6:9001/localfile/4K/10-Incredible-4K-Ultra-HD-Videos-YouTube_0.mp4'
			},
			{
				url: 'http://vjs.zencdn.net/v/oceans.mp4',
				poster: 'img/oceans.png'
			},
			{	
				url:'http://media.w3.org/2010/05/sintel/trailer.mp4',
				poster: 'img/SINTEL_poster.jpg'
			}, 
			{	
				url:'http://media.w3.org/2010/05/bunny/trailer.mp4',
				poster: 'img/BUNNY_poster.jpg'
			},
			{
				url: 'http://ultravideo.cs.tut.fi/video/Jockey_1920x1080_30fps_420_8bit_AVC_MP4.mp4'
			},
			{
				url: 'http://ultravideo.cs.tut.fi/video/Beauty_1920x1080_30fps_420_8bit_AVC_MP4.mp4'
			},
			{
				url: 'http://ultravideo.cs.tut.fi/video/Bosphorus_1920x1080_30fps_420_8bit_AVC_MP4.mp4'
			},
			{
				url: 'http://ultravideo.cs.tut.fi/video/HoneyBee_1920x1080_30fps_420_8bit_AVC_MP4.mp4'
			},
			{
				url: 'http://ultravideo.cs.tut.fi/video/ReadySetGo_1920x1080_30fps_420_8bit_AVC_MP4.mp4'
			}
		];

    var player = null;
	var canPlay = false;
    /**
     * Creates HTML video tag and adds all event listeners
     */
    function createPlayer() {
        var _player = document.createElement('video');
        _player.controls = false;
		
        _player.addEventListener('loadeddata', function () {
            controls.log("Movie loaded.");
        });
        _player.addEventListener('loadedmetadata', function () {
            controls.log("Meta data loaded.");
        });
        _player.addEventListener('timeupdate', function () {
            controls.log("Current time: " + _player.currentTime);
            progress.updateProgress(_player.currentTime, _player.duration);
        });
        _player.addEventListener('play', function () {
            controls.log("Playback started.");
			controls.playBtn.innerHTML = "pause";
			controls.playBtn.title = "pause";
        });
        _player.addEventListener('pause', function () {
            controls.log("Playback paused.");
			controls.playBtn.innerHTML = "play_arrow";
			controls.playBtn.title = "play";
        });
        _player.addEventListener('ended', function () {
            controls.log("Playback finished.");
            end();
        });
		_player.onerror = function (e) {
			var target = e.target || e.srcElement;
			var error = target.error;
			if (!error) return;
			var msg = '';
			switch (error.code) {
				case 1:
					msg = 'MEDIA_ERR_ABORTED';
					break;
				case 2:
					msg = 'MEDIA_ERR_NETWORK';
					break;
				case 3:
					msg = 'MEDIA_ERR_DECODE';
					break;
				case 4:
					msg = 'MEDIA_ERR_SRC_NOT_SUPPORTED';
					break;
				case 5:
					msg = 'MEDIA_ERR_ENCRYPTED';
					break;
				default:
					msg = 'UNKNOWN';
					break;
			}
			if (error.message) {
				msg += ' (' + error.message + ')';
			}
			if (error.msExtendedCode) {
				msg += ' (0x' + (error.msExtendedCode >>> 0).toString(16).toUpperCase() + ')';
			}
			controls.log(msg);
        };
		_player.oncanplay = function() {
			canPlay = true; 
			controls.log('open finished');
		};
        return _player;
    }
	
    /**
     * Stop the player when application is closed.
     */
    function onUnload() {
    	controls.log('onUnload');
        stop();
    }

    /**
     * Choose next source video and poster
     */
	var currentSource = 0;
	var playList_ = playList;
    function changeSource(n) {
		currentSource = (playList_.length + currentSource + n %  playList_.length) % playList_.length;
        load(playList_[currentSource]);
    }
    
    /**
     * Function to load source.
     */
    function load(source) {
		canPlay = false;
        player.poster = source.poster || '';
        player.src = source.url || '';
        player.load();
        progress.reset();
		controls.reset();
    }

    /**
     * Function to control video playback.
     */
    function play() {
        player.play();
    }

    function pause() {
        player.pause();
    }
    
	function playPause() {
		if(!canPlay) {
			return;
		}
		if(player.paused) {
			play();
		}else {
			pause();
		}
	}
	
    function stop() {
		player.src = '';
		player.poster = '';
        player.removeAttribute('src');
		player.removeAttribute('poster');
		progress.reset();
		controls.reset();
    }
	
	function end() {
		controls.playBtn.innerHTML = "replay";
		controls.playBtn.title = "replay";
		setPlaybackRate(1);
	}
    
	// fast rewind 
	var rewindInterval;
	function fastRewind() {
		if(controls.seekJump > 60){
			return;
		}
		if(forwardInterval){
			controls.seekJump = 0;
			clearInterval(forwardInterval);
			forwardInterval = null;
			setPlaybackRate(1);
			return;
		}
		
		if(rewindInterval){
			clearInterval(rewindInterval);
			rewindInterval = null;
		}
		setPlaybackRate(0);
		controls.seekJump += 10;
		rewindInterval = setInterval(function(){
			if (!player.seeking && getValidBufferDuration() > 1) {
				if (player.currentTime - controls.seekJump < 0) {
					player.currentTime = 0;
					clearInterval(rewindInterval);
					rewindInterval = null;
					controls.seekJump = 0;
					setPlaybackRate(1);
					player.pause();
				}else {
					player.currentTime -= controls.seekJump;
				}
			}else{
				return;
			}
		}, 1000);
	}
	
	// fast forward
	var forwardInterval;
	function fastForward() {
		if(controls.seekJump > 60){
			return;
		}
		if(rewindInterval){
			controls.seekJump = 0;
			clearInterval(rewindInterval);
			rewindInterval = null;
			setPlaybackRate(1);
			return;
		}
		
		if(forwardInterval){
			clearInterval(forwardInterval);
			forwardInterval = null;
		}
		setPlaybackRate(0);
		controls.seekJump += 10;
		forwardInterval = setInterval(function(){
			if (!player.seeking && getValidBufferDuration() > 1) {
				if (player.currentTime + controls.seekJump > player.duration) {
					player.currentTime = player.duration;
					clearInterval(forwardInterval);
					forwardInterval = null;
					controls.seekJump = 0;
					setPlaybackRate(1);
				}else {
					player.currentTime += controls.seekJump;
				}
			}else{
				return;
			}
		}, 1000);
	}

	function getSeekableRange() {
		var range = { start: 0, end: 0 };
		for (var i = 0; i < player.seekable.length; i ++) {
			range.start = player.seekable.start(i);
			range.end = player.seekable.end(i);
			break;
		}
		return range;
    }
	
	function getValidBufferDuration() {
        var currentPos = player.currentTime;
        for (var i = 0; i < player.buffered.length; ++i) {
            if (currentPos >= player.buffered.start(i) &&
                currentPos <= player.buffered.end(i)) {
                return player.buffered.end(i) - currentPos;
            }
        }
        return 0;
    }
	
	function playSlow() {
		if(player.playbackRate > 1) {
			setPlaybackRate(1);
		}else if(player.playbackRate > 0.1) {
			setPlaybackRate(player.playbackRate - 0.1);
		}else{
			setPlaybackRate(0.1);
		}
    }
	
	function playFast() {
        if(player.playbackRate < 1) {
			setPlaybackRate(1);
		}else if(player.playbackRate < 16) {
			setPlaybackRate(player.playbackRate + 1);
		}
    }
	
	function setPlaybackRate(n) {
		player.playbackRate = n;
		controls.playSpeed.innerHTML = (player.playbackRate).toFixed(1);
	}
	
	function seek(event) {
		if(!canPlay) {
			return;
		}
		var e = event || window.event;
		var rect = progress.dom.getBoundingClientRect();
		var offsetX = e.clientX - rect.left;
		if (offsetX < 0) {
			offsetX = 0;
		} else if (offsetX > rect.width) {
			offsetX = rect.width;
		}
		player.currentTime = (offsetX / rect.width) * player.duration;
	}
	
	function playPrevious() {
		changeSource(-1);
		controls.log('play the previous');
	}
	
	function playNext() {
		changeSource(1);
		controls.log('play the next');
	}
	
	function playValid () {
		var i = 0;
		function playValid_ () {
			if (i === playList.length) {
				controls.log('there is no valid link in the play list');
				stop();
				player.removeEventListener('error', playValid_);
				return;
			}
			playNext();
			i++;
		}
		player.addEventListener('error', playValid_);
		function removeE () {
			player.removeEventListener('error', playValid_);
			player.removeEventListener('canplay', removeE);
		}
		player.addEventListener('canplay', removeE);
		
		/*
		var i = 0;
		function playValid_ () {
			if (canPlay) {
				return;
			}
			if(i === playList.length) {
				controls.log('there is no valid link in the play list');
				stop();
				return;
			}
			playNext();
			i++;
			setTimeout(playValid_, 10000);
		}
		setTimeout(playValid_, 10000);
		*/
	}
	
	/**
     * vulume control
     */
	function mute() {
		player.muted = !player.muted;
		if(player.muted) {
			controls.muteBtn.title = 'unmute';
			controls.muteBtn.innerHTML = 'volume_off';
		}else {
			controls.muteBtn.title = 'mute';
			volumeIcon();
		}
	}
	
	function volumeIcon() {
		if(player.volume === 0) {
			controls.muteBtn.innerHTML = 'volume_mute';
		}else if(player.volume < 0.5) {
			controls.muteBtn.innerHTML = 'volume_down';
		}else if(player.volume >= 0.5) {
			controls.muteBtn.innerHTML = 'volume_up';
		}
	}
	
	function volumerBarClick(event) {
		var e = event || window.event;
		var rect = controls.volumeBar.getBoundingClientRect();
		var offsetX = e.clientX - rect.left;
		if(offsetX > 60){
			offsetX = 60;
		}else if(offsetX < 0){
			offsetX = 0;
		}
		controls.volumeSlider.style.left = offsetX - 5 + 'px';
		player.volume = offsetX/60;
		if(player.muted) {
			player.muted = false;
			controls.muteBtn.title = 'mute';
		}
		volumeIcon();
	}

	//volume slide drag
	function volumerSlider(event) {
		var volumeInterval;
		controls.controlBar.addEventListener('mousemove', getVolumeMoveX);
		volumeInterval = setInterval(function(){
			var offsetX = controls.volumeMouveX - controls.volumeStartX;
			if(offsetX > 60){
				offsetX = 60;
			}else if(offsetX < 0){
				offsetX = 0;
			}
			controls.volumeSlider.style.left = offsetX - 5 + 'px';
			player.volume = offsetX/60;
			volumeIcon();
		},50);
		document.addEventListener('mouseup', volumeMoveEnd);
	
		function getVolumeMoveX(event) {
		var e = event || window.event;
		e.preventDefault();
		controls.volumeMouveX = e.clientX;
		}
		function volumeMoveEnd() {
			controls.controlBar.removeEventListener('mousemove', getVolumeMoveX);
			clearInterval(volumeInterval);
			document.removeEventListener('mouseup', volumeMoveEnd);
		}
	}
	
	/**
     * right controls
     */
	function enterFullscreen() {
		player.webkitEnterFullscreen();
	}
	
    /**
     * Object handling updating of progress bar
     */
    var progress = {
        init: function () {
            this.dom = document.getElementById('progress');
            this.barEl = document.getElementById('bar');
            this.dom.addEventListener('click', seek);
            this.reset();
        },

        reset: function () {
            this.barEl.style.width = 0;
            this.show();
        },

        updateProgress: function (elapsed, total) {
            var progress = 100 * elapsed / total;
            this.barEl.style.width = progress + '%';
        },

        show: function () {
            this.dom.style.visibility = "visible";
        },

        hide: function () {
            this.dom.style.visibility = "hidden";
        }
    };

	/**
     * Object of control bar
     */
	var controls = {
		init: function () {
			this.videoContainer = document.querySelector('.video-container');
			this.controlBar = document.querySelector('.controls');
			this.playBtn = document.querySelector('.playBtn');
			this.stopBtn = document.querySelector('.stopBtn');
			this.playSlowBtn = document.querySelector('.playSlowBtn');
			this.playSpeed = document.querySelector('.playSpeed');
			this.playFastBtn = document.querySelector('.playFastBtn');
			this.seekJump = 0;
			this.rewindBtn = document.querySelector('.rewindBtn');
			this.forwardBtn = document.querySelector('.forwardBtn');
			this.previousBtn = document.querySelector('.previousBtn');
			this.nextBtn = document.querySelector('.nextBtn');
			this.muteBtn = document.querySelector('.muteBtn');
			this.volumeBar = document.querySelector('.volume-bar');
			this.volumeSlider = document.querySelector('.volume-slider');
			
			/* volume bar slide */
			this.volumeStartX = this.volumeBar.getBoundingClientRect().left;
			this.volumeMouveX = null;
			
			/* play time refresh */
			this.playTimeTip = document.querySelector('.play-time');
			
			/* buffer icon */
			this.bufferingSpinner = document.querySelector('.bufferingSpinner');
			
			this.menuBtn = document.querySelector('.menuBtn');
			this.subtitlesBtn = document.querySelector('.subtitlesBtn');
			this.settingsBtn = document.querySelector('.settingsBtn');
			this.fullscreenBtn = document.querySelector('.fullscreenBtn');
			
			this.logOn = false;
			this.logArr = [];
			this.logsArea = document.getElementById('logs');
			this.logToggleBtn = document.querySelector('.logToggle');
			this.logClearBtn = document.querySelector('.clearLogBtn');
			this.logUploadBtn = document.querySelector('.logUpload');
			this.logServer = document.querySelector('.logServer');
			
			this.videoContainer.addEventListener('click', playPause);
			this.playBtn.addEventListener('click', playPause);
			this.stopBtn.addEventListener('click', stop);
			this.playSlowBtn.addEventListener('click', playSlow);
			this.playFastBtn.addEventListener('click', playFast);
			this.rewindBtn.addEventListener('click', fastRewind);
			this.forwardBtn.addEventListener('click', fastForward);
			this.previousBtn.addEventListener('click', playPrevious);
			this.nextBtn.addEventListener('click', playNext);
			this.muteBtn.addEventListener('click', mute);
			this.volumeBar.addEventListener('click', volumerBarClick);
			this.volumeSlider.addEventListener('mousedown', volumerSlider);
			this.fullscreenBtn.addEventListener('click', enterFullscreen);
			this.logToggleBtn.addEventListener('click', this.logToggle.bind(this));
			this.logClearBtn.addEventListener('click', this.logClear.bind(this));
			this.logUploadBtn.addEventListener('click', this.logUpload.bind(this));
			this.setListener();
		},
		setListener: function () {
			this.playTimeInterval = setInterval(this.playTimeRefresh.bind(this), 1000);
			this.bufferInterval = setInterval(this.bufferControl.bind(this), 1000);
		},
		playTimeRefresh: function () {
			if (player && player.src) {
				var currentT = player.currentTime ? (player.currentTime).toFixed(0) : 0;
				var durationT = player.duration ? (player.duration).toFixed(0) : 0;
				var currentTH = Math.floor(currentT/3600);
				currentTH = currentTH < 10 ? '0'+currentTH : currentTH;
				var currentTM = Math.floor(currentT/60);
				currentTM = currentTM < 10 ? '0'+currentTM : currentTM;
				var currentTS = currentT%60;
				currentTS = currentTS < 10 ? '0'+currentTS : currentTS;
				var durationTH = Math.floor(durationT/3600);
				durationTH = durationTH < 10 ? '0'+durationTH : durationTH;
				var durationTM = Math.floor(durationT/60);
				durationTM = durationTM < 10 ? '0'+durationTM : durationTM;
				var durationTS = durationT%60;
				durationTS = durationTS < 10 ? '0'+durationTS : durationTS;
				if (durationT/3600 >= 1) {
					this.playTimeTip.innerHTML = currentTH + ':' + currentTM + ':' + currentTS +
						' / ' + durationTH + ':' + durationTM + ':' + durationTS;
				}else {
					this.playTimeTip.innerHTML = currentTM + ':' + currentTS + ' / ' + durationTM + ':' + durationTS;
				}
			}
		},
		bufferControl: function () {
			if(player && player.src) {
				if(getValidBufferDuration() > 1 || player.ended) {
					this.bufferingSpinner.style.display = 'none';
				}else{
					this.bufferingSpinner.style.display = 'flex';
				}
			}
		},
		log: function (msg) {
			if (msg) {
				if (!this.logOn) {
					return;
				}
				this.logsArea.innerHTML += msg + '<br />';
				this.logArr.push(msg+'\n');
			} else {
				// Clear logs
				this.logsArea.innerHTML = '';
				this.logArr = [];
			}
			this.logsArea.scrollTop = this.logsArea.scrollHeight;
		},
		logToggle: function () {
			this.logOn = !this.logOn;
			if (this.logOn) {
				this.logToggleBtn.innerHTML = 'toggle_on';
				this.logToggleBtn.title = 'log_off';
			} else {
				this.logToggleBtn.innerHTML = 'toggle_off';
				this.logToggleBtn.title = 'log_on';
			}
		},
		logClear: function () {
			this.log('');
		},
		logUpload: function () {
			if (this.logServer.value === '' || this.logArr === []) {
				return;
			}
			var blob = new Blob(this.logArr, {type: "text/plain"});
			var formData = new FormData();
			var logName = "volog_" + Date.parse(new Date()) + ".txt";
			formData.append("fileToUpload", blob, logName);

			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.logServer.value);
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
				if (xhr.status == 200) {
				  alert('Upload ' + logName + ' success.');
				} else {
				  alert('Upload ' + logName + ' failed: ' + xhr.response);
				}
			  }
			}
			xhr.send(formData);
		},
		reset: function () {
			this.playBtn.innerHTML = "play_arrow";
			this.playBtn.title = "play";
			setPlaybackRate(1);
			this.playTimeTip.innerHTML = "00:00 / 00:00";
			this.bufferingSpinner.style.display = 'none';
			canPlay = false;
		}

	}
	
	/**
     * Object of custom
     */
	 var custom = {
		 init: function() {
			 this.inputLink = document.querySelector('.link-input');
			 this.loadLink = document.querySelector('.link-load');
			 this.addLink = document.querySelector('.link-add');
			 this.loadPlaylist = document.querySelector('.playList-load');
			 
			 this.loadLink.addEventListener('click', this.loadLinkFun);
			 this.addLink.addEventListener('click', this.addLinkFun);
			 this.loadPlaylist.addEventListener('click', this.loadPlaylistFun);
		 },
		 loadLinkFun: function() {
			 playList_ = [{
					poster: '',
					url: custom.inputLink.value
				 }];
			 load(playList_[0]);
		 },
		 addLinkFun: function() {
			 var source_ = {
				 poster: '',
				 url: custom.inputLink.value
			 };
			 playList.unshift(source_);
		 },
		 loadPlaylistFun: function() {
			 playList_ = playList;
			 load(playList_[0]);
		 }
	 };
	
	/**
	 * Element.insertAfter(newNode,targetNode)
	 */
	Element.prototype.insertAfter = function  (newNode,targetNode){
			var nextNode = targetNode.nextSibling;
			var fatherNode = targetNode.parentNode;
			if(nextNode) {
				fatherNode.insertBefore(newNode,nextNode);
			}else {
				fatherNode.appendChild(newNode);
			}
	}
	
    /**
     * Start the application once loading is finished
     */
    window.onload = function () {
		progress.init();
		controls.init();
		custom.init();
        player = createPlayer();
        document.querySelector('.videoPlayer').appendChild(player);
		
		controls.logOn = true;
		load(playList_[0]);
		playValid();
		
		document.body.addEventListener('unload', onUnload);
    };
})();