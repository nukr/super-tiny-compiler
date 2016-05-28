import test from 'ava'
import { parser } from '../src'

test('parser', (t) => {
  let input = [
    {type: 'parenthesis', value: '('},
    {type: 'name', value: 'add'},
    {type: 'number', value: '2'},
    {type: 'parenthesis', value: '('},
    {type: 'name', value: 'substract'},
    {type: 'number', value: '42'},
    {type: 'number', value: '3'},
    {type: 'parenthesis', value: ')'},
    {type: 'parenthesis', value: ')'}
  ]

  let expected = {
    type: 'Program',
    body: [
      {
        type: 'CallExpression',
        name: 'add',
        params: [
          {
            type: 'NumberLiteral',
            value: '2'
          },
          {
            type: 'CallExpression',
            name: 'substract',
            params: [
              {
                type: 'NumberLiteral',
                value: '42'
              },
              {
                type: 'NumberLiteral',
                value: '3'
              }
            ]
          }
        ]
      }
    ]
  }
  let result = parser(input)
  t.deepEqual(result, expected)
})

test('parser2', (t) => {
  let input = [
    {type: 'parenthesis', value: '('},
    {type: 'name', value: 'add'},
    {type: 'parenthesis', value: '('},
    {type: 'name', value: 'add'},
    {type: 'number', value: '3'},
    {type: 'number', value: '5'},
    {type: 'parenthesis', value: ')'},
    {type: 'parenthesis', value: '('},
    {type: 'name', value: 'substract'},
    {type: 'number', value: '42'},
    {type: 'number', value: '3'},
    {type: 'parenthesis', value: ')'},
    {type: 'parenthesis', value: ')'}
  ]

  let expected = {
    type: 'Program',
    body: [
      {
        type: 'CallExpression',
        name: 'add',
        params: [
          {
            type: 'CallExpression',
            name: 'add',
            params: [
              {
                type: 'NumberLiteral',
                value: '3'
              },
              {
                type: 'NumberLiteral',
                value: '5'
              }
            ]
          },
          {
            type: 'CallExpression',
            name: 'substract',
            params: [
              {
                type: 'NumberLiteral',
                value: '42'
              },
              {
                type: 'NumberLiteral',
                value: '3'
              }
            ]
          }
        ]
      }
    ]
  }
  let result = parser(input)
  t.deepEqual(result, expected)
})

test('parser throw error', (t) => {
  t.throws(() => parser([{type: 'undefined_type'}]), TypeError)
})
