#!/bin/bash
# ============================================================
# 数字孪生系统 - 一键部署脚本
# 在服务器上执行: bash deploy-digital-twin.sh
# ============================================================

set -e

echo "=========================================="
echo "  数字孪生系统 - 一键部署"
echo "=========================================="

# ---- 1. 部署静态文件 ----
WEB_ROOT="/usr/share/nginx/html"
TARGET_DIR="${WEB_ROOT}/digital-twin"

echo ""
echo "[1/4] 创建目录: ${TARGET_DIR}"
mkdir -p "${TARGET_DIR}"

echo "[2/4] 部署静态文件..."
# 将当前目录下的 dist 内容复制到目标目录
if [ -d "dist" ]; then
    cp -rf dist/* "${TARGET_DIR}/"
    echo "  ✅ 静态文件部署完成"
else
    echo "  ❌ 未找到 dist 目录，请确保在项目根目录执行"
    exit 1
fi

# ---- 2. 配置 Nginx ----
echo ""
echo "[3/4] 配置 Nginx..."

NGINX_CONF="/etc/nginx/conf.d/digital-twin.conf"

cat > "${NGINX_CONF}" << 'NGINX_EOF'
server {
    listen 80;
    server_name _;

    location /digital-twin/ {
        alias /usr/share/nginx/html/digital-twin/;
        index index.html;
        try_files $uri $uri/ /digital-twin/index.html;
    }
}
NGINX_EOF

echo "  ✅ Nginx配置已写入: ${NGINX_CONF}"

# ---- 3. 更新首页卡片 ----
echo ""
echo "[4/4] 更新首页卡片..."

INDEX_FILE="${WEB_ROOT}/index.html"

if [ -f "${INDEX_FILE}" ]; then
    # 在 "添加新系统" 占位卡片之前插入数字孪生系统卡片
    NEW_CARD='            <!-- 数字孪生系统 -->
            <a href="/digital-twin/" class="system-card" style="--card-color: #0ea5e9; --card-color-light: #38bdf8; --card-shadow: rgba(14, 165, 233, 0.3); --tag-bg: rgba(14, 165, 233, 0.1); --tag-color: #0ea5e9;">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%); box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);">🏭</div>
                    <div class="card-title-group">
                        <div class="card-title">数字孪生系统</div>
                        <div class="card-subtitle">Digital Twin System</div>
                    </div>
                </div>
                <div class="card-description">
                    工厂数字孪生可视化平台，内置产线设备、传感器、能源动力等模板，支持3D场景构建与实时数据监测
                </div>
                <div class="card-features">
                    <span class="feature-tag" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">3D可视化</span>
                    <span class="feature-tag" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">设备模板</span>
                    <span class="feature-tag" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">实时监测</span>
                    <span class="feature-tag" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">Demo模拟</span>
                </div>
                <div class="card-footer">
                    <div class="card-status">
                        <span class="status-dot"></span>
                        <span>运行中</span>
                    </div>
                    <div class="card-arrow" style="background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);">→</div>
                </div>
            </a>

'

    # 使用 sed 在 "add-system" div 之前插入新卡片
    if grep -q "add-system" "${INDEX_FILE}"; then
        sed -i "/<!-- 添加新系统占位 -->/i\\${NEW_CARD}" "${INDEX_FILE}"
        echo "  ✅ 首页卡片已添加"
    else
        echo "  ⚠️ 未找到占位卡片，跳过首页更新（不影响系统使用）"
    fi

    # 更新统计数字（10 -> 11）
    sed -i 's/<div class="stat-value">10<\/div>/<div class="stat-value">11<\/div>/' "${INDEX_FILE}"
    echo "  ✅ 统计数字已更新: 10 -> 11"
else
    echo "  ⚠️ 未找到首页文件: ${INDEX_FILE}"
fi

# ---- 4. 重载 Nginx ----
echo ""
echo "重载 Nginx..."
nginx -t && nginx -s reload
echo "  ✅ Nginx 重载成功"

echo ""
echo "=========================================="
echo "  🎉 部署完成！"
echo "  访问地址: https://123.207.74.78/digital-twin/"
echo "  首页入口: https://123.207.74.78/"
echo "=========================================="
