class PeerService {
        constructor() {
                if (!this.peer) {
                        this.peer = new RTCPeerConnection({
                                iceServers: [
                                        {
                                                urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"],
                                        },
                                ],
                        });
                }
        }

        async getAnswer(offer) {
                if (this.peer) {
                        await this.peer.setRemoteDescription(offer);
                        const ans = await this.peer.createAnswer();
                        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
                        return ans;
                }
        }

        async setLocalDescription(answer) {
                if (this.peer) {
                        if (answer === "endCall") {
                                await this.peer.setRemoteDescription(new RTCSessionDescription(null));
                        } else {
                                await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
                        }
                }
        }

        async getOffer() {
                if (this.peer) {
                        const offer = await this.peer.createOffer();
                        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
                        return offer;
                }
        }
}

export default new PeerService();
