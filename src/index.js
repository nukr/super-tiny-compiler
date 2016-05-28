// TODO:
// (add 22 (subtract 43 2))
// add(22, substract(43, 2))

function code_generator () {}

export function compiler (input) {
  var tokens = lexer(input)
  var ast = parser(tokens)
  var next_ast = transformer(ast)
  var output = code_generator(next_ast)
  return output
}

export function lexer (input) {
  let WHITE_SPACE = /[\s]/
  let NUMBERS = /[0-9]/
  let LETTERS = /[a-z]/i

  let current = 0
  let tokens = []
  while (current < input.length) {
    let char = input[current]
    if (WHITE_SPACE.test(char)) {
      current += 1
      continue
    }

    if (char === '(' || char === ')') {
      tokens.push({
        type: 'parenthesis',
        value: char
      })
      current += 1
      continue
    }

    if (NUMBERS.test(char)) {
      let value = ''
      while (NUMBERS.test(char)) {
        value += char
        current += 1
        char = input[current]
      }
      tokens.push({
        type: 'number',
        value
      })
      continue
    }

    if (LETTERS.test(char)) {
      let value = ''
      while (LETTERS.test(char)) {
        value += char
        current += 1
        char = input[current]
      }
      tokens.push({
        type: 'name',
        value
      })
      continue
    }

    throw new TypeError('I dont know what this character is: ' + char)
  }
  return tokens
}

export function parser (tokens) {
  let current = 0
  function walk () {
    let token = tokens[current]
    if (token.type === 'number') {
      current += 1
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }

    if (token.type === 'parenthesis') {
      if (token.value === '(') {
        current += 1
        token = tokens[current]

        let node = {
          type: 'CallExpression',
          name: token.value,
          params: []
        }
        current += 1
        token = tokens[current]

        while (
          (token.type !== 'parenthesis') ||
            (token.type === 'parenthesis' && token.value !== ')')
        ) {
          node.params.push(walk())
          token = tokens[current]
        }

        current += 1
        return node
      }
    }

    throw new TypeError(token.type)
  }

  let ast = {
    type: 'Program',
    body: []
  }
  while (current < tokens.length) {
    ast.body.push(walk())
  }
  return ast
}

function traverser (ast, visitor) {
  function traverse_array (array, parent) {
    array.forEach((child) => {
      traverse_node(child, parent)
    })
  }

  function traverse_node (node, parent) {
    let method = visitor[node.type]

    if (method) method(node, parent)

    switch (node.type) {
      case 'Program':
        traverse_array(node.body, node)
        break
      case 'CallExpression':
        traverse_array(node.params, node)
        break
      case 'NumberLiteral':
        break
      default:
        throw new TypeError(node.type)
    }
  }

  traverse_node(ast, null)
}

export function transformer (ast) {
  let next_ast = {
    type: 'Program',
    body: []
  }

  ast._context = next_ast.body

  let visitor = {
    NumberLiteral: (node, parent) => {
      parent._context.push({
        type: 'NumberLiteral',
        value: node.value
      })
    },
    CallExpression: (node, parent) => {
      let expression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: node.name
        },
        arguments: []
      }
      node._context = expression.arguments
      if (parent.type !== 'CallExpression') {
        expression = {
          type: 'ExpressionStatement',
          expression: expression
        }
      }
      parent._context.push(expression)
    }
  }
  traverser(ast, visitor)
  return next_ast
}
