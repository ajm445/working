import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      // Gzip 압축 (프로덕션 전용)
      isProduction &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240, // 10KB 이상 파일만 압축
          algorithm: 'gzip',
          ext: '.gz',
        }),
      // 번들 크기 분석 (프로덕션 빌드 시에만 활성화)
      isProduction &&
        visualizer({
          filename: './dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),

    server: {
      port: 3000,
      host: true,
    },

    build: {
      outDir: 'dist',
      // 프로덕션에서는 소스맵 비활성화
      sourcemap: !isProduction,
      // 청크 크기 경고 한도 (500KB)
      chunkSizeWarningLimit: 500,
      // Rollup 옵션
      rollupOptions: {
        output: {
          // 코드 스플리팅: 벤더 라이브러리 분리
          manualChunks: {
            // React 관련
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // UI 라이브러리
            'ui-vendor': ['react-hot-toast', 'clsx'],
            // 차트 라이브러리 (큰 용량)
            'chart-vendor': ['recharts'],
            // Supabase
            'supabase-vendor': ['@supabase/supabase-js'],
            // 유틸리티
            'utils-vendor': ['axios'],
          },
        },
      },
      // Terser를 사용한 최소화 설정
      minify: 'terser',
      terserOptions: {
        compress: {
          // 프로덕션에서 console.* 제거
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    },

    css: {
      postcss: './postcss.config.js',
    },

    // 프로덕션 빌드 최적화
    esbuild: {
      // 프로덕션에서 debugger 문 제거
      drop: isProduction ? ['debugger'] : [],
    },
  };
});
