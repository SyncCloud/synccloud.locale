FROM quay.io/ndelitski/nodejs
MAINTAINER Nick Delitski

#Set timezone to Moscow
RUN   ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime

ADD   ./ /var/app

RUN   mkdir /etc/service/sc_locale
ADD   ./runit /etc/service/sc_locale/run
RUN   chmod +x /etc/service/sc_locale/run

ENV   PORT 80
