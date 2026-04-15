export const appStyles = `
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.45)}70%{transform:scale(0.9)}100%{transform:scale(1)}}
@keyframes levelUpAnim{0%{opacity:0;transform:translateX(-50%) translateY(10px) scale(0.8)}30%{opacity:1;transform:translateX(-50%) translateY(-4px) scale(1.05)}100%{opacity:0;transform:translateX(-50%) translateY(-28px) scale(1)}}
@keyframes comboAnim{0%{opacity:0;transform:translateX(-50%) translateY(0) scale(0.8)}15%{opacity:1;transform:translateX(-50%) translateY(-8px) scale(1.05)}80%{opacity:1;transform:translateX(-50%) translateY(-16px)}100%{opacity:0;transform:translateX(-50%) translateY(-24px) scale(0.9)}}
@keyframes plantBob{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-3px) rotate(1.5deg)}}
@keyframes plantCelebrate{0%{transform:scale(1)}20%{transform:scale(1.18) rotate(-3deg)}40%{transform:scale(1.22) rotate(3deg)}60%{transform:scale(1.15) rotate(-2deg)}80%{transform:scale(1.08) rotate(1deg)}100%{transform:scale(1)}}
@keyframes impPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,159,39,0.35)}50%{box-shadow:0 0 0 5px rgba(239,159,39,0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes bannerIn{0%{opacity:0;transform:translateY(10px) scale(0.95)}40%{opacity:1;transform:translateY(-3px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}
.task-card{animation:fadeSlideIn 0.2s ease;transition:box-shadow 0.2s,transform 0.15s,opacity 0.3s}
.task-card:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,0.1)}
.check-btn{transition:transform 0.15s,background 0.2s}.check-btn:hover{transform:scale(1.1)}
.check-btn.pop{animation:pop 0.4s ease}
.xp-bar-fill,.day-bar-fill{transition:width 0.5s cubic-bezier(.4,0,.2,1)}
.lvl-toast{animation:levelUpAnim 1.8s ease forwards}
.combo-toast{animation:comboAnim 1.4s ease forwards}
.plant-idle{animation:plantBob 3s ease-in-out infinite}
.plant-celebrate{animation:plantCelebrate 0.7s ease}
.imp-card{animation:impPulse 2.5s ease-in-out infinite}
.drag-over{outline:2px dashed #aaa;outline-offset:2px}
.spinner{animation:spin 0.8s linear infinite}
.banner-in{animation:bannerIn 0.5s ease forwards}
`;
