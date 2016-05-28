import test from 'ava'
import { lexer } from '../src'

test('lexer', (t) => {
  let expected = [
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
  let result = lexer('(add 2 (substract 42 3))')

  t.deepEqual(result, expected)
})

test('lexer2', (t) => {
  let expected = [
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
  let result = lexer('(add (add 3 5) (substract 42 3))')

  t.deepEqual(result, expected)
})

test('lexer throw error', (t) => {
  t.throws(() => lexer('+'), TypeError)
})
