# 使用Nginx作为生产服务器
FROM nginx:alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 复制自定义Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从本地复制构建好的文件到Nginx目录
COPY dist/ .

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]