(function(){
    'use strict';
    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
	var logOn = false;
    function log(msg) {
        var logsEl = document.getElementById('logs');

        if (msg) {
            // Update logs
            //console.log('[PlayerHTML5]: ', msg);
			if (!logOn) {
				return;
			}
            logsEl.innerHTML += msg + '<br />';
        } else {
            // Clear logs
            logsEl.innerHTML = '';
        }

        logsEl.scrollTop = logsEl.scrollHeight;
    }

    var playList = [
			{
				url: 'http://vjs.zencdn.net/v/oceans.mp4',
				poster: 'img/oceans.png'
			},
			{	url: 'http://10.2.68.6:9001/localfile/4K/10-Incredible-4K-Ultra-HD-Videos-YouTube_0.mp4'
			},
			{	url:'http://media.w3.org/2010/05/sintel/trailer.mp4',
				poster: 'img/SINTEL_poster.jpg'
			}, 
			{	url:'http://media.w3.org/2010/05/bunny/trailer.mp4',
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

    /**
     * Creates HTML video tag and adds all event listeners
     */
    function createPlayer() {
        var _player = document.createElement('video');
        _player.controls = false;
		
        _player.addEventListener('loadeddata', function () {
            log("Movie loaded.");
        });
        _player.addEventListener('loadedmetadata', function () {
            log("Meta data loaded.");
        });
        _player.addEventListener('timeupdate', function () {
            log("Current time: " + _player.currentTime);
            progress.updateProgress(_player.currentTime, _player.duration);
        });
        _player.addEventListener('play', function () {
            log("Playback started.");
			controls.playBtn.innerHTML = "pause";
			controls.playBtn.title = "pause";
        });
        _player.addEventListener('pause', function () {
            log("Playback paused.");
			controls.playBtn.innerHTML = "play_arrow";
			controls.playBtn.title = "play";
        });
        _player.addEventListener('ended', function () {
            log("Playback finished.");
            end();
        });
		_player.addEventListener('click', playPause);

        return _player;
    }
	
    /**
     * Stop the player when application is closed.
     */
    function onUnload() {
    	log('onUnload');
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
		if(player.paused) {
			play();
		}else {
			pause();
		}
	}
	
    function stop() {
        player.pause();
        player.currentTime = 0;
        setPlaybackRate(1);
		controls.playBtn.innerHTML = "play_arrow";
		controls.playBtn.title = "play";
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
			controls.seekJump = 5;
			clearInterval(forwardInterval);
			setPlaybackRate(1);
			return;
		}
		
		if(rewindInterval){
			clearInterval(rewindInterval);
		}
		setPlaybackRate(0);
		rewindInterval = setInterval(function(){
			if (!player.seeking && player.currentTime - controls.seekJump > player.seekable.start(0)) {
				player.currentTime -= controls.seekJump;
			}else{
				return;
			}
		}, 1000);
		controls.seekJump += 5;
	}
	
	// fast forward
	var forwardInterval;
	function fastForward() {
		if(controls.seekJump > 60){
			return;
		}
		if(rewindInterval){
			controls.seekJump = 5;
			clearInterval(rewindInterval);
			setPlaybackRate(1);
			return;
		}
		
		if(forwardInterval){
			clearInterval(forwardInterval);
		}
		setPlaybackRate(0);
		forwardInterval = setInterval(function(){
			if (!player.seeking && player.currentTime + controls.seekJump < player.seekable.end(0)) {
				player.currentTime += controls.seekJump;
			}else{
				return;
			}
		}, 1000);
		controls.seekJump += 5;
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
		if(player.playbackRate >= 1) {
			controls.playSpeed.innerHTML = player.playbackRate;
		}else {
			controls.playSpeed.innerHTML = (player.playbackRate).toFixed(1);
		}
	}
	
	function seek(event) {
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
	}
	
	function playNext() {
		changeSource(1);
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
	var volumeInterval;		
	function volumerSlider(event) {
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
	}
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
			this.controlBar = document.querySelector('.controls');
			this.playBtn = document.querySelector('.playBtn');
			this.stopBtn = document.querySelector('.stopBtn');
			this.playSlowBtn = document.querySelector('.playSlowBtn');
			this.playSpeed = document.querySelector('.playSpeed');
			this.playFastBtn = document.querySelector('.playFastBtn');
			this.seekJump = 5;
			this.rewindBtn = document.querySelector('.rewindBtn');
			this.forwardBtn = document.querySelector('.forwardBtn');
			this.previousBtn = document.querySelector('.previousBtn');
			this.nextBtn = document.querySelector('.nextBtn');
			this.muteBtn = document.querySelector('.muteBtn');
			this.volumeBar = document.querySelector('.volume-bar');
			this.volumeSlider = document.querySelector('.volume-slider');
			
			this.volumeStartX = this.volumeBar.getBoundingClientRect().left;
			this.volumeMouveX = null;
			
			this.menuBtn = document.querySelector('.menuBtn');
			this.subtitlesBtn = document.querySelector('.subtitlesBtn');
			this.settingsBtn = document.querySelector('.settingsBtn');
			this.fullscreenBtn = document.querySelector('.fullscreenBtn');
			
			this.logToggleBtn = document.querySelector('.logToggle');
			this.logClearBtn = document.querySelector('.clearLogBtn');
			
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
			this.logClearBtn.addEventListener('click', this.logClear);
			
		},
		logToggle: function () {
			logOn = !logOn;
			if (logOn) {
				this.logToggleBtn.innerHTML = 'toggle_on';
				this.logToggleBtn.title = 'log_off';
			} else {
				this.logToggleBtn.innerHTML = 'toggle_off';
				this.logToggleBtn.title = 'log_on';
			}
		},
		logClear: function () {
			log('');
		},
		reset: function () {
			this.playBtn.innerHTML = "play_arrow";
			this.playBtn.title = "play";
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
        document.querySelector('.left').insertAfter(player, progress.dom);
		
		load(playList_[0]);
		
		document.body.addEventListener('unload', onUnload);
    };
})();