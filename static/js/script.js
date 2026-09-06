/**
 * ANINDITA SHIL RIMA - 24TH BIRTHDAY SURPRISE
 * Master Single Page Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // Enable JS state
    document.documentElement.classList.remove('no-js');

    /* ==========================================================================
       1. STATE MANAGEMENT
       ========================================================================== */
    const state = {
        currentChapter: 0,
        totalChapters: 13,
        galleryIndex: 0,
        galleryPhotos: [
            { src: '/static/image/rima1.jpg', caption: 'White outside, Chaos inside' },
            { src: '/static/image/rima2.jpg', caption: 'SUN Kissing,cz "NEKK" missing' },
            { src: '/static/image/rima3.jpg', caption: 'Eyes loaded, Junior warned' },
            { src: '/static/image/rima4.jpg', caption: 'Serving looks, cz common sense stocks out!' },
            { src: '/static/image/rima5.jpg', caption: 'All you need to Start and Stop WWIII' },
            { src: '/static/image/rima6.jpg', caption: 'Keeping MALE-EGO below this line' }
        ],
        sharedPhotos: [
            '/static/image/us1.jpg',
            '/static/image/us2.jpg',
            '/static/image/us3.jpg',
            '/static/image/us4.jpg'

        ],
        sharedIndex: 0,
        audioPlaying: null
    };

    /* ==========================================================================
       2. DOM ELEMENTS
       ========================================================================== */
    const elements = {
        curtainContainer: document.getElementById('curtainContainer'),
        chapterTracker: document.getElementById('chapterTracker'),
        chapterBadge: document.getElementById('chapterBadge'),
        chapters: document.querySelectorAll('.chapter'),
        appBg: document.getElementById('appBg'),
        shoeContainer: document.getElementById('shoeContainer'),
        
        // Chapter 1
        btnEnter: document.getElementById('btnEnter'),
        
        // Chapter 2
        btnToGallery: document.getElementById('btnToGallery'),
        cntMonths: document.getElementById('cntMonths'),
        cntDays: document.getElementById('cntDays'),
        
        // Chapter 3
        polaroidImg: document.getElementById('polaroidImg'),
        polaroidNum: document.getElementById('polaroidNum'),
        polaroidText: document.getElementById('polaroidText'),
        btnPrevPhoto: document.getElementById('btnPrevPhoto'),
        btnNextPhoto: document.getElementById('btnNextPhoto'),
        btnNextPhotoText: document.getElementById('btnNextPhotoText'),
        
        // Chapter 4
        slideshowImg: document.getElementById('slideshowImg'),
        btnToCall: document.getElementById('btnToCall'),
        
        // Chapter 5
        phoneWrapper: document.getElementById('phoneWrapper'),
        btnAcceptCall: document.getElementById('btnAcceptCall'),
        btnDeclineCall: document.getElementById('btnDeclineCall'),
        callDialog: document.getElementById('callDialog'),
        btnAfterCall: document.getElementById('btnAfterCall'),
        
        // Chapter 6
        btnPlayRimaSong: document.getElementById('btnPlayRimaSong'),
        btnStopRimaSong: document.getElementById('btnStopRimaSong'),
        visualizerBars: document.getElementById('visualizerBars'),
        rimaSongText: document.getElementById('rimaSongText'),
        btnToCourtroom: document.getElementById('btnToCourtroom'),
        rimaSongFallback: document.getElementById('rimaSongFallback'),
        
        // Chapter 7
        btnVerdict: document.getElementById('btnVerdict'),
        verdictBox: document.getElementById('verdictBox'),
        btnToLawyer: document.getElementById('btnToLawyer'),
        
        // Chapter 8
        btnToSecrets: document.getElementById('btnToSecrets'),
        
        // Chapter 9
        btnUnlockSecret: document.getElementById('btnUnlockSecret'),
        classifiedFiles: document.getElementById('classifiedFiles'),
        secretLockIcon: document.getElementById('secretLockIcon'),
        btnToHeart: document.getElementById('btnToHeart'),
        
        // Chapter 10
        rimaHeart: document.getElementById('rimaHeart'),
        btnToCountdown: document.getElementById('btnToCountdown'),
        
        // Chapter 11 (Countdown & Candle Drama)
        countdownPhase: document.getElementById('countdownPhase'),
        countdownNumber: document.getElementById('countdownNumber'),
        revealPhase: document.getElementById('revealPhase'),
        candleBanner: document.getElementById('candleBanner'),
        candleFlame: document.getElementById('candleFlame'),
        btnToDedicatedSong: document.getElementById('btnToDedicatedSong'),

        // Chapter 12 (Dedicated Video)
        forBestieVideo: document.getElementById('forBestieVideo'),
        btnToFinalMessage: document.getElementById('btnToFinalMessage'),

        // Chapter 13 (Final Letter & Repeat)
        btnRepeat: document.getElementById('btnRepeat'),
        
        // Audio Elements
        bgMusic: document.getElementById('bgMusic'),
        audioTease: document.getElementById('audioTease'),
        audioBday: document.getElementById('audioBday'),
        firecrackersSFX: document.getElementById('firecrackersSFX'),
        crowdSFX: document.getElementById('crowdSFX'),
        clappingSFX: document.getElementById('clappingSFX')
    };

    /* ==========================================================================
       3. AUDIO MANAGER & BACKGROUND MUSIC HANDLER
       ========================================================================== */
    const AudioManager = {
        playBgMusic() {
            if (elements.bgMusic && elements.bgMusic.paused) {
                elements.bgMusic.play().catch(err => console.warn('Bg music autoplay prevented:', err));
            }
        },

        pauseBgMusic() {
            if (elements.bgMusic && !elements.bgMusic.paused) {
                elements.bgMusic.pause();
            }
        },

        play(audioEl, fallbackEl, onPlayCb) {
            this.stopTeaseAndBday();
            if (!audioEl) return;

            const playPromise = audioEl.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    state.audioPlaying = audioEl;
                    if (onPlayCb) onPlayCb();
                }).catch(err => {
                    console.warn('Audio play blocked or failed:', err);
                    if (fallbackEl) fallbackEl.classList.remove('hidden');
                });
            }
        },

        stopTeaseAndBday() {
            [elements.audioTease, elements.audioBday].forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
            state.audioPlaying = null;
            if (elements.visualizerBars) elements.visualizerBars.classList.remove('playing');
        }
    };

    // ১ম রিকোয়েস্ট: ইউজার সাইটে যেকোনো জায়গায় প্রথম ক্লিক করলেই ব্যাকগ্রাউন্ড মিউজিক শুরু হবে
    document.body.addEventListener('click', () => {
        AudioManager.playBgMusic();
    }, { once: true });

    // ১ম রিকোয়েস্ট: ভিডিও প্লে হলে ব্যাকগ্রাউন্ড মিউজিক পজ হবে এবং শেষ/পজ হলে আবার স্টার্ট হবে
    if (elements.forBestieVideo) {
        elements.forBestieVideo.addEventListener('play', () => {
            AudioManager.pauseBgMusic();
        });
        elements.forBestieVideo.addEventListener('pause', () => {
            if (!elements.forBestieVideo.ended) {
                AudioManager.playBgMusic();
            }
        });
        elements.forBestieVideo.addEventListener('ended', () => {
            AudioManager.playBgMusic();
        });
    }

    /* ==========================================================================
       4. NAVIGATION & CHAPTER TRANSITIONS
       ========================================================================== */
    function goToChapter(index) {
        if (index < 0 || index > state.totalChapters) return;

        // Hide current
        const currentEl = document.querySelector(`.chapter[data-chapter="${state.currentChapter}"]`);
        if (currentEl) currentEl.classList.remove('active');

        state.currentChapter = index;

        // Update Tracker
        if (index > 0) {
            elements.chapterBadge.textContent = `${String(index).padStart(2, '0')} / ${String(state.totalChapters).padStart(2, '0')}`;
        }

        // Show target
        const targetEl = document.querySelector(`.chapter[data-chapter="${index}"]`);
        if (targetEl) {
            targetEl.classList.add('active');
            targetEl.scrollTop = 0;
        }

        // Trigger Chapter Specific Logic
        handleChapterActivation(index);
    }

    function handleChapterActivation(index) {
        switch (index) {
            case 2:
                animateCounters();
                break;
            case 4:
                startSharedSlideshow();
                break;
            case 10:
                animateHeart();
                break;
            case 11:
                startBirthdayCountdown();
                break;
        }
    }

    /* ==========================================================================
       5. CHAPTER LOGIC & INTERACTION
       ========================================================================== */

    // ৭ম রিকোয়েস্ট: লোডিং ডিলে ১.৮ সেকেন্ডে লিমিট করা হয়েছে
    setTimeout(() => {
        goToChapter(1);
    }, 2000);

    // Chapter 1: Opening
    elements.btnEnter.addEventListener('click', () => {
        AudioManager.playBgMusic();
        elements.curtainContainer.classList.add('open');
        setTimeout(() => {
            goToChapter(2);
        }, 800);
    });

    // Chapter 2: 7 Years Counters
    function animateCounters() {
        let months = 0;
        let days = 0;
        const targetMonths = 84;
        const targetDays = 2555;

        const interval = setInterval(() => {
            months += 2;
            days += 60;
            if (months >= targetMonths) months = targetMonths;
            if (days >= targetDays) days = targetDays;

            elements.cntMonths.textContent = `~${months}`;
            elements.cntDays.textContent = `~${days.toLocaleString()}`;

            if (months === targetMonths && days === targetDays) {
                clearInterval(interval);
            }
        }, 30);
    }

    elements.btnToGallery.addEventListener('click', () => goToChapter(3));

    // Chapter 3: Polaroid Gallery
    function updateGallery() {
        const item = state.galleryPhotos[state.galleryIndex];
        elements.polaroidImg.src = item.src;
        elements.polaroidText.textContent = item.caption;
        elements.polaroidNum.textContent = `${String(state.galleryIndex + 1).padStart(2, '0')} / 06`;

        if (state.galleryIndex === state.galleryPhotos.length - 1) {
            elements.btnNextPhotoText.textContent = 'PROCEED TO EMOTION';
        } else {
            elements.btnNextPhotoText.textContent = 'NEXT PHOTO';
        }
    }

    elements.btnNextPhoto.addEventListener('click', () => {
        if (state.galleryIndex < state.galleryPhotos.length - 1) {
            state.galleryIndex++;
            updateGallery();
        } else {
            goToChapter(4);
        }
    });

    elements.btnPrevPhoto.addEventListener('click', () => {
        if (state.galleryIndex > 0) {
            state.galleryIndex--;
            updateGallery();
        }
    });

    // Chapter 4: Emotional Friendship
    let slideshowInterval;
    function startSharedSlideshow() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => {
            state.sharedIndex = (state.sharedIndex + 1) % state.sharedPhotos.length;
            elements.slideshowImg.src = state.sharedPhotos[state.sharedIndex];
        }, 3500);
    }

    elements.btnToCall.addEventListener('click', () => goToChapter(5));

    // Chapter 5: Fake Call
    elements.btnAcceptCall.addEventListener('click', () => {
        elements.phoneWrapper.classList.remove('vibrating');
        elements.phoneWrapper.classList.add('hidden');
        elements.callDialog.classList.remove('hidden');
    });

    elements.btnDeclineCall.addEventListener('click', () => {
        elements.btnAcceptCall.click();
    });

    elements.btnAfterCall.addEventListener('click', () => goToChapter(6));

    // Chapter 6: Teasing Song
    elements.btnPlayRimaSong.addEventListener('click', () => {
        AudioManager.play(elements.audioTease, elements.rimaSongFallback, () => {
            elements.visualizerBars.classList.add('playing');
            elements.btnPlayRimaSong.classList.add('hidden');
            elements.btnStopRimaSong.classList.remove('hidden');
            elements.rimaSongText.classList.remove('hidden');
        });
    });

    elements.btnStopRimaSong.addEventListener('click', () => {
        AudioManager.stopTeaseAndBday();
        elements.btnPlayRimaSong.classList.remove('hidden');
        elements.btnStopRimaSong.classList.add('hidden');
    });

    elements.btnToCourtroom.addEventListener('click', () => {
        AudioManager.stopTeaseAndBday();
        goToChapter(7);
    });

    // Chapter 7: Courtroom
    elements.btnVerdict.addEventListener('click', () => {
        elements.btnVerdict.classList.add('hidden');
        elements.verdictBox.classList.remove('hidden');
        elements.btnToLawyer.classList.remove('hidden');
    });

    elements.btnToLawyer.addEventListener('click', () => goToChapter(8));

    // Chapter 8: Lawyer
    elements.btnToSecrets.addEventListener('click', () => goToChapter(9));

    // Chapter 9: Top Secret
    elements.btnUnlockSecret.addEventListener('click', () => {
        elements.btnUnlockSecret.classList.add('hidden');
        elements.secretLockIcon.textContent = '🔓';
        elements.classifiedFiles.classList.remove('hidden');
        elements.btnToHeart.classList.remove('hidden');
    });

    elements.btnToHeart.addEventListener('click', () => goToChapter(10));

    // Chapter 10: Backwards Heart
    function animateHeart() {
        setTimeout(() => {
            elements.rimaHeart.classList.add('rotated');
        }, 1500);
    }

    elements.btnToCountdown.addEventListener('click', () => goToChapter(11));

    // Chapter 11: Countdown, Firecrackers, Shoes & Candle Drama
    function startBirthdayCountdown() {
        let count = 3;
        elements.countdownNumber.textContent = count;

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                elements.countdownNumber.textContent = count;
            } else {
                clearInterval(timer);
                elements.countdownPhase.classList.add('hidden');
                elements.revealPhase.classList.remove('hidden');
                
                // ২য় রিকোয়েস্ট: 3-2-1 এর পর Firecrackers, Crowd Sound & Shoes Emoji Throw
                triggerEffectsAndCandleDrama();
            }
        }, 1000);
    }

    function triggerEffectsAndCandleDrama() {
        // Sound Effects & Firecrackers
        if (elements.firecrackersSFX) elements.firecrackersSFX.play().catch(() => {});
        if (elements.crowdSFX) elements.crowdSFX.play().catch(() => {});
        triggerConfetti();
        launchShoesEmoji();

        // ৩য় রিকোয়েস্ট: Candle Blowing Drama Timeline
        setTimeout(() => {
            if (elements.candleFlame) elements.candleFlame.style.opacity = '0.3'; // নিভু নিভু অবস্থা
        }, 3000);

        setTimeout(() => {
            if (elements.candleBanner) elements.candleBanner.textContent = "EIII FUUUU TEH KAAJ HOBE NAA RE PAGLIIIIII";
        }, 5500);

        setTimeout(() => {
            if (elements.candleBanner) elements.candleBanner.textContent = "ARO JOREE DEH, EX RE URAY NITEE HOBEEEEEEE";
        }, 8000);

        setTimeout(() => {
            if (elements.candleFlame) elements.candleFlame.style.display = 'none'; // ক্যান্ডেল পুরোপুরি নিভে যাওয়া
            if (elements.clappingSFX) elements.clappingSFX.play().catch(() => {});
            if (elements.btnToDedicatedSong) elements.btnToDedicatedSong.classList.remove('hidden');
        }, 10000);
    }

    // ২য় রিকোয়েস্ট: Shoes Emoji Burst
    function launchShoesEmoji() {
        const emojis = ['👠', '👟', '👞', '👡', '👢'];
        for (let i = 0; i < 20; i++) {
            const shoe = document.createElement('div');
            shoe.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            shoe.style.position = 'fixed';
            shoe.style.left = Math.random() * 90 + 'vw';
            shoe.style.bottom = '-50px';
            shoe.style.fontSize = (Math.random() * 20 + 30) + 'px';
            shoe.style.zIndex = '9999';
            shoe.style.transition = 'transform 2.5s ease-out, opacity 2.5s';
            
            document.body.appendChild(shoe);

            setTimeout(() => {
                shoe.style.transform = `translateY(-${Math.random() * 500 + 300}px) rotate(${Math.random() * 360}deg)`;
                shoe.style.opacity = '0';
            }, 50);

            setTimeout(() => shoe.remove(), 2600);
        }
    }

    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    }

    // Chapter 11 -> Chapter 12 Transition
    elements.btnToDedicatedSong.addEventListener('click', () => goToChapter(12));

    // Chapter 12 -> Chapter 13 Transition
    elements.btnToFinalMessage.addEventListener('click', () => goToChapter(13));

    // ৬ষ্ঠ রিকোয়েস্ট: REPEAT Button Logic
    elements.btnRepeat.addEventListener('click', () => {
        AudioManager.stopTeaseAndBday();
        if (elements.forBestieVideo) {
            elements.forBestieVideo.pause();
            elements.forBestieVideo.currentTime = 0;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        goToChapter(1);
    });

    /* ==========================================================================
       6. PARTICLE CANVAS BG
       ========================================================================== */
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const particleContainer = document.getElementById('particleCanvas');
    if (particleContainer) particleContainer.appendChild(canvas);

    let particles = [];
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.y -= this.speedY;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(201, 164, 92, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor(window.innerWidth / 10), 40);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function renderParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(renderParticles);
    }
    renderParticles();
});