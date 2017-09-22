let chai = require('chai')

let assert = chai.assert
let expect = chai.expect
let should = chai.should()

let validate = require('./../../src/renderer/validate')
let $ = require('jquery/dist/jquery.js')

before(function() {
  $(document.body).append("<div id='editor'></div>")
  $(document.body).append("<div id='message-panel'></div>")
  window._ = require('lodash')
})

describe('displayValidationMessages', function() {
  beforeEach(function() {
    validation = {
      'state': 'warnings',
      'errors': [],
      'warnings': [
        {
          'type': 'inconsistent_values',
          'category': 'schema',
          'row': null,
          'col': 13
        },
        {
          'type': 'inconsistent_values',
          'category': 'schema',
          'row': null,
          'col': 23
        }
      ],
      'info': [
        {
          'type': 'assumed_header',
          'category': 'structure',
          'row': null,
          'col': null
        }
      ]
    }
  })

  it('should display validation results', function() {
    validate._private.displayValidationMessages(validation)
    expect($('#message-panel').html()).to.have.string('Validation result')
    expect($('#message-panel img').attr('src')).to.equal('../static/img/warnings.svg')
    expect($('#message-panel p').html()).to.have.string('0 errors and 2 warnings')
    expect($('#message-panel div:eq(0)').html()).to.have.string('<h5>Inconsistent value</h5><p>The data in column M is inconsistent with others values in the same column.</p>')
    expect($('#message-panel div:eq(1)').html()).to.have.string('<h5>Inconsistent value</h5><p>The data in column W is inconsistent with others values in the same column.</p>')
  })

  it('should display a message is the CSV is valid', function() {
    validation.warnings = []
    validation.errors = []
    validation.info = []
    validate._private.displayValidationMessages(validation)
    expect($('#message-panel').html()).to.have.string('Congratulations! Your CSV appears to be valid.')
  })

  it('does not display minus info messages', function() {
    validation.info = []
    validate._private.displayValidationMessages(validation)
    expect($('#message-panel p').html()).to.have.string('0 errors and 2 warnings')
  })
})

describe('numToCol', function() {
  it('returns a single lettered column', function() {
    expect(validate._private.numToCol(6)).to.equal('F')
    expect(validate._private.numToCol(1)).to.equal('A')
  })

  it('returns a double lettered column', function() {
    expect(validate._private.numToCol(27)).to.equal('AA')
    expect(validate._private.numToCol(32)).to.equal('AF')
    expect(validate._private.numToCol(58)).to.equal('BF')
  })
})
