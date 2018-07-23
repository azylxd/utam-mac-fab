
// ERRORES
export const ERROR = {
    FLAG_ERROR: {
        error: 'itr->vote_percent != o.weight: You have already voted in a similar way.',
        message: 'You have already flag this post with the same percentage.'
    },
    DUPLICATE_REBLOG: {
        error: 'blog_itr == blog_comment_idx.end(): Account has already reblogged this post',
        message: 'You have already reblogged this post'
    },
    POST_INTERVAL: {
        error: '( now - auth.last_root_post ) > STEEM_MIN_ROOT_COMMENT_INTERVAL: You may only post once every 5 minutes.',
        message: 'You may only post once every 5 minutes.'
    },
    COMMENT_INTERVAL: {
        error: '(now - auth.last_post) > STEEM_MIN_REPLY_INTERVAL: You may only comment once every 20 seconds.',
        message: 'You may only comment once every 20 seconds.'
    },
    POST_TOO_BIG: {
        fingerprint: '<= (get_dynamic_global_properties().maximum_block_size - 256)',
        message: 'Your post is too big.',
    },
    NO_INTERNET: {
        message: 'Revise su conexión a intenet'
    },
    NOT_FOUND: {
        message: 'Problema de comunicación con nuestros servidores'
    },
    TIMEOUT: {
        message: 'Tiempo de espera agotado'
    }
};
