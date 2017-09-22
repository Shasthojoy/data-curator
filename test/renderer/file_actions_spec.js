import {HotRegister} from './../../src/renderer/hot.js'
import chai from 'chai'
import * as $ from 'jquery/dist/jquery.js'
import {rows} from './../../src/renderer/ragged-rows'
import {file_actions} from './../../src/renderer/file-actions'
import {fs} from 'fs'
import {os} from 'os'

let assert = chai.assert
let expect = chai.expect
let should = chai.should()

before(function() {
  window._ = require('lodash')
})

beforeEach(function () {
  let hotView = document.createElement('div')
  document.body.appendChild(hotView)
  HotRegister.register(hotView)
  let hot = HotRegister.getActiveInstance()
})

describe('open file (comma separated)', function() {
  it('opens a file (comma separated)', function() {
    let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6'
    hot.addHook('afterLoadData', function() {
      expect(hot.getData()).to.eql([['foo', 'bar', 'baz'], ['1', '2', '3'], ['4', '5', '6']])
    })
    file_actions.open(hot, data)
  })
})

describe('open file (semicolon separated)', function() {
  it('opens a file (semicolon separated)', function() {
    let data = 'foo;bar;baz\r\n1;2;3\r\n4;5;6'
    hot.addHook('afterLoadData', function() {
      expect(hot.getData()).to.eql([['foo', 'bar', 'baz'], ['1', '2', '3'], ['4', '5', '6']])
    })
    file_actions.open(hot, data, file_actions.formats.semicolon)
  })
})

describe('save file', function() {
  it('saves a file', function(done) {
    let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6\r\n'
    hot.addHook('afterLoadData', function() {
      file_actions.save(hot, os.tmpdir() + '/mycsv.csv', file_actions.formats.csv, function() {
        fs.readFile(os.tmpdir() + '/mycsv.csv', 'utf-8', function (err, d) {
          expect(d).to.eq(data)
          expect(document.title).to.eq(os.tmpdir() + '/mycsv.csv')
          done()
        })
      })
    })
    file_actions.open(hot, data)
  })
})

describe('convert file', function() {
  it('converts a file from csv to tsv', function(done) {
    let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6'
    hot.addHook('afterLoadData', function() {
      file_actions.save(hot, os.tmpdir() + '/mytsv.tsv', file_actions.formats.tsv, function() {
        fs.readFile(os.tmpdir() + '/mytsv.tsv', 'utf-8', function (err, d) {
          expect(d).to.eq('foo\tbar\tbaz\r\n1\t2\t3\r\n4\t5\t6\r\n')
          done()
        })
      })
    })
    file_actions.open(hot, data)
  })
})
