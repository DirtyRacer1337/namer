'use strict'

const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const targetPath = path.resolve(__dirname, 'namer', 'web')

module.exports = {
    entry: [
        './src/js/main.js',
        './src/css/main.scss'
    ],
    mode: 'production',
    performance: {
        hints: false
    },
    output: {
        path: path.resolve(targetPath, 'public', 'assets'),
        filename: 'bundle.min.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'bundle.min.css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: path.resolve(__dirname, 'src', 'templates'),
                    from: './**/*.html',
                    to: path.resolve(targetPath, 'templates')
                }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'postcss-preset-env'
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env']
                        ]
                    }
                }
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.html$/i,
                type: 'asset/resource'
            },
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: {
                                removeAll: true
                            }
                        }
                    ]
                }
            }),
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false
                    }
                }
            }),
            new HtmlMinimizerPlugin({
                test: /\.html/i,
                minimizerOptions: {
                    collapseWhitespace: true,
                    conservativeCollapse: false,
                    includeAutoGeneratedTags: false,
                    ignoreCustomFragments: [
                        /{%.*?%}/,
                        /{{.*?}}/
                    ],
                    minifyJS: true,
                    removeComments: true,
                    trimCustomFragments: false
                }
            })
        ]
    }
}

