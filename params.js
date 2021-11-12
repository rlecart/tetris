const params = {
  server: {
    host: '0.0.0.0',
    port: 3004,
    get url() { return 'http://' + this.host + ':' + this.port; },
    get url2() { return 'http://' + this.host + ':' + '8080'; },
  },
};

// export default params;
module.exports = params