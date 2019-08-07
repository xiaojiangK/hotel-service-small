Page({
    data: {
        url: '/assets/image/Invite-qr.png'
    },
    onLoad() {},
    preview() {
        wx.previewImage({
            urls: [this.data.url]
        });
    }
});