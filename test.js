var WooCommerce = require('./index.js');
var chai = require('chai');
var nock = require('nock');

describe('#Construct', function() {
  it('should throw an error if the url, consumerKey or consumerSecret are missing', function() {
    chai.expect(function() {
      new WooCommerce();
    }).to.throw(Error);
  });

  it('should set the default options', function() {
    var api = new WooCommerce({
      url: 'http://test.dev',
      consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    });

    chai.expect(api.version).to.equal('v3');
    chai.expect(api.isSsl).to.be.false;
    chai.expect(api.verifySsl).to.be.true;
    chai.expect(api.encoding).to.equal('utf8');
  });
});

describe('#Requests', function() {
  beforeEach(function() {
    nock.cleanAll();
  });

  var api = new WooCommerce({
    url: 'https://test.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  });

  it('should return content for basic auth', function(done) {
    nock('https://test.dev/wc-api/v3').post('/orders', {}).reply(200, {
      ok: true
    });

    api.post('orders', {}, function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return content for get requests', function(done) {
    nock('https://test.dev/wc-api/v3').get('/orders').reply(200, {
      ok: true
    });

    api.get('orders', function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return content for put requests', function(done) {
    nock('https://test.dev/wc-api/v3').put('/orders', {}).reply(200, {
      ok: true
    });

    api.put('orders', {}, function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return content for delete requests', function(done) {
    nock('https://test.dev/wc-api/v3').delete('/orders').reply(200, {
      ok: true
    });

    api.delete('orders', function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should no return content when not using ssl', function(done) {
    nock('http://test.dev/wc-api/v3').get('/orders').reply(200, {
      ok: true
    });

    api.get('orders', function(err, data) {
      chai.expect(err).to.exist;
      chai.expect(data).to.not.exist;
      done();
    });
  });

  it('should return content for OAuth', function(done) {
    var oAuth = new WooCommerce({
      url: 'http://test.dev',
      consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    });

    nock('http://test.dev/wc-api/v3').filteringPath(/\?.*/, '?params').get('/orders?params').reply(200, {
      ok: true
    });

    oAuth.get('orders', function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

});
