import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//ElementPlus自动引入配置1/2
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //ElementPlus自动引入配置2/2
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue'], // 指定自动导入的模块
      // dts: true // 生成自动导入的TypeScript声明文件
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    
  ],
  resolve: {
    alias: {
        // 设置路径
        '~': path.resolve(__dirname, './public'),
        // 设置别名
        '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
},
})
