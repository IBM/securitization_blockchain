FROM ubuntu:16.04
# docker run -it -v /var/run/docker.sock -v /usr/local/bin/docker:/usr/local/bin/docker ubuntu:16.04 bash
RUN apt-get install -y curl
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
COPY .
RUN cd sc-ui && npm install
RUN cd sc-ui/react_backend && npm install
