// https://docs.bitnami.com/aws/infrastructure/nodejs/get-started/get-started/
// https://pm2.keymetrics.io/docs/usage/startup/
// Run
sudo npm install pm2 -g
pm2 startup
sudo env PATH=$PATH:/opt/bitnami/node/bin /opt/bitnami/node/lib/node_modules/pm2/bin/pm2 startup systemd -u bitnami --hp /home/bitnami

sudo mkdir /opt/bitnami/projects
sudo chown $USER /opt/bitnami/projects
cd /opt/bitnami/projects
express --view pug garage
cd garage

// pull from git
npm install
PORT=3000 pm2 start ./bin/www --name garage
pm2 save



// Created /opt/bitnami/apache/conf/vhosts/vhost.conf

<VirtualHost 127.0.0.1:80 _default_:80>
  ServerAlias *
  DocumentRoot /opt/bitnami/projects/garage
  <Directory "/opt/bitnami/projects/garage">
    Options -Indexes +FollowSymLinks -MultiViews
    AllowOverride All
    Require all granted
  </Directory>
  ProxyPass / http://localhost:3000/
  ProxyPassReverse / http://localhost:3000/
</VirtualHost>

// Created /opt/bitnami/apache/conf/vhosts/https-vhost.conf

<VirtualHost 127.0.0.1:443 _default_:443>
  ServerAlias *
  SSLEngine on
  SSLCertificateFile "/opt/bitnami/apache/conf/bitnami/certs/server.crt"
  SSLCertificateKeyFile "/opt/bitnami/apache/conf/bitnami/certs/server.key"
  DocumentRoot /opt/bitnami/projects/garage
  <Directory "/opt/bitnami/projects/garage">
    Options -Indexes +FollowSymLinks -MultiViews
    AllowOverride All
    Require all granted
  </Directory>
  ProxyPass / http://localhost:3000/
  ProxyPassReverse / http://localhost:3000/
</VirtualHost>

// https://docs.bitnami.com/aws/faq/administration/generate-configure-certificate-letsencrypt/
// Disabled IP6 in lightsail
// Run
sudo /opt/bitnami/ctlscript.sh restart apache
sudo /opt/bitnami/bncert-tool



### Set environement variables for database

```
npm install pg
npm install dotenv
touch .env
```

**Add to file .env**

```
RDS_HOSTNAME=hostname
RDS_PORT=portnum
RDS_DB_NAME=database
RDS_USERNAME=username
RDS_PASSWORD=password
```

### Setup auth0

// https://www.youtube.com/watch?v=QQwo4E_B0y8

```
npm install express-openid-connect
```

