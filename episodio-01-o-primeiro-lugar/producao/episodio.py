"""Roteiro do episódio em forma de dados: falas, pausas, marcadores, efeitos e trilhas.

Cada cena é uma sequência: cada fala/pausa/marcador começa depois do anterior.
  F(id, quem, texto, gap)   fala (gap = silêncio antes dela, em segundos)
  P(seg)                    pausa
  M(id, gap)                marcador de tempo (para a animação ou efeitos)
  S(tipo, em, desloc, ganho) efeito sonoro preso a um marcador/fala (não avança o tempo)
Música: lista de (estilo, marcador_de_início). Ambiente: (tipo, marcador_ini, marcador_fim).
"""

def F(id, quem, texto, gap=0.5, junto=False, rate=None):
    return dict(k='fala', id=id, quem=quem, texto=texto, gap=gap, junto=junto, rate=rate)

def P(seg):
    return dict(k='pausa', seg=seg)

def M(id, gap=0.0):
    return dict(k='marca', id=id, gap=gap)

def S(tipo, em, desloc=0.0, ganho=1.0):
    return dict(k='sfx', tipo=tipo, em=em, desloc=desloc, ganho=ganho)


# Vozes (edge-tts, gratuitas). speed>1 = acelera depois (evitado para não distorcer).
VOZES = {
    "narradora": dict(voice="pt-BR-ThalitaMultilingualNeural", rate="-5%", pitch="+0Hz"),
    "davi":      dict(voice="pt-BR-FranciscaNeural", rate="+5%", pitch="+30Hz"),
    "vovo":      dict(voice="pt-BR-AntonioNeural", rate="-12%", pitch="-12Hz"),
    "mamae":     dict(voice="pt-BR-FranciscaNeural", rate="-3%", pitch="-4Hz"),
    "lucas":     dict(voice="pt-BR-AntonioNeural", rate="+8%", pitch="+55Hz"),
    "jesus":     dict(voice="pt-BR-AntonioNeural", rate="-10%", pitch="-2Hz", eco=True),
    "marta":     dict(voice="pt-BR-ThalitaMultilingualNeural", rate="+10%", pitch="+6Hz", eco=True),
}

CENAS = [
    # ------------------------------------------------------------------ 0
    dict(id="c0", nome="Abertura", fim_extra=0.0, musica=[("tema", "@ini")], itens=[
        M("ini"), P(31.0), M("fim"),
    ]),
    # ------------------------------------------------------------------ 1
    dict(id="c1", nome="O presente", musica=[("alegre", "@ini")], ambiente=[("passaros", "ini", "fim")], itens=[
        M("ini"), P(0.6),
        F("n1", "narradora", "Era uma manhã ensolarada, e o Davi tinha acabado de ganhar um presente muito especial.", 0.4),
        M("abre", 0.7), S("whoosh", "abre", -0.1, .5), S("brilho", "abre", 0.05),
        F("d1", "davi", "Uau! Um videogame novinho! Eu vou jogar o dia inteiro!", 1.0),
        M("balido", 0.3), S("balido", "balido", 0, .45), P(0.8),
        F("v1", "vovo", "Que presente bonito, Davi! Só não vá se esquecer de quem a gente ama acima de todas as coisas, hein?", 0.4),
        F("d1b", "davi", "Pode deixar, vô! Eu não vou esquecer!", 0.4),
        M("corre", 0.1), P(2.2), S("porta", "corre", 2.0, .7),
        M("ovelha", 0.2), P(2.6), M("fim"),
    ]),
    # ------------------------------------------------------------------ 2
    dict(id="c2", nome="Dia após dia", musica=[("alegre", "@ini"), ("triste", "@quinta")], itens=[
        M("ini"), P(0.5),
        F("n2", "narradora", "E o Davi jogou... e jogou... e jogou.", 0.3), P(1.2),
        M("segunda", 0.2), P(1.6), S("plim", "segunda"),
        M("ovelhaEntra"), P(2.4),
        F("d2", "davi", "Agora não, Algodão!", 0.2), M("ovelhaSai", 0.2), P(2.6),
        M("terca", 0.3), P(1.6), S("plim", "terca"),
        F("m1", "mamae", "Davi! O almoço está na mesa!", 0.2),
        F("d3", "davi", "Já vou, mãe! Só mais uma fase!", 0.3),
        M("prato", 0.4), P(3.0),
        M("quarta", 0.3), P(1.6), S("plim", "quarta"),
        M("mamaeEntra"), P(1.4),
        F("m2", "mamae", "Olha que lindo, filho! Ela desenhou você e o Algodão!", 0.1),
        F("d4", "davi", "Hum-hum... legal, mãe.", 0.4),
        M("mamaeSai", 0.4), P(2.4),
        M("quinta", 0.3), P(1.8), S("plim", "quinta"),
        M("vovoEntra"), P(1.2),
        F("v2", "vovo", "Vamos conversar com Deus antes de dormir, campeão?", 0.1),
        F("d5", "davi", "Hoje não, vô... tô quase zerando!", 0.4),
        M("vovoSai", 0.6), P(2.6),
        M("coracao", 0.3),
        F("n3", "narradora", "O Davi dizia que amava a Deus. Mas, sem perceber, estava dando todo o seu tempo, toda a sua atenção e todo o seu carinho... para o videogame.", 0.8),
        P(2.0), M("fim"),
    ]),
    # ------------------------------------------------------------------ 3
    dict(id="c3", nome="O convite do Lucas", musica=[("alegre", "@ini"), ("suspense", "@portao")], ambiente=[("passaros", "ini", "fim")], itens=[
        M("ini"), P(0.8), M("toc"), S("toc", "toc"), P(1.2),
        M("abre", 0.2), P(1.0),
        F("l1", "lucas", "E aí, Davi! Bora jogar bola na pracinha? A turma toda vai!", 0.2),
        F("d6", "davi", "Ah, Lucas... não dá. Eu tenho que passar de fase.", 0.4),
        F("l2", "lucas", "Mas você tá jogando desde segunda!", 0.3),
        F("d7", "davi", "E daí? É o melhor jogo do mundo!", 0.3),
        F("l3", "lucas", "Tá bom... Amanhã a gente se vê na escola dominical, então?", 0.6),
        F("d8", "davi", "Hã... talvez.", 0.5),
        M("lucasSai", 0.2), P(1.8), M("fecha"), S("porta", "fecha", 0, .8), P(1.0),
        M("portao", 0.3), P(4.2),
        F("n4", "narradora", "E o Davi nem percebeu... que alguém também tinha saído pelo portão.", 0.2),
        P(1.5), M("fim"),
    ]),
    # ------------------------------------------------------------------ 4
    dict(id="c4", nome="Cadê o Algodão?", musica=[("suspense", "@ini"), ("triste", "@vovo")], ambiente=[("grilos", "ini", "fim"), ("vento", "ini", "fim")], itens=[
        M("ini"), P(1.0),
        F("d9", "davi", "Algodão? Algodão, vem comer!", 0.4), P(2.4),
        F("d10", "davi", "Algodão?!", 0.2),
        M("procura", 0.3), P(4.0),
        F("d11", "davi", "Vô! O Algodão sumiu!", 0.2),
        M("vovo", 0.2),
        F("v3", "vovo", "Calma, Davi. Vamos procurar juntos.", 0.6),
        M("lucas", 0.4), P(1.2),
        F("l4", "lucas", "Não vi não, Davi... mas eu te ajudo a procurar!", 0.2),
        M("controle", 0.6), S("bip", "controle", 0.3), S("bip", "controle", 0.7), S("bip", "controle", 1.0), S("gameover", "controle", 1.6), P(3.4),
        F("d12", "davi", "O videogame não pode me ajudar...", 0.3), P(2.0), M("fim"),
    ]),
    # ------------------------------------------------------------------ 5
    dict(id="c5", nome="A oração no morro", musica=[("oracao", "@ini"), ("alegre", "@achou")], ambiente=[("vento", "ini", "achou"), ("riacho", "ini", "fim")], itens=[
        M("ini"), P(4.6), M("ajoelha"), P(2.0),
        F("d13", "davi", "Deus... me desculpa. Eu falei que amava o Senhor, mas não conversei com o Senhor a semana toda.", 0.3),
        F("d13b", "davi", "Esqueci do Algodão. Não dei atenção pra mamãe, nem pro Lucas, nem pro vovô. O videogame ficou mais importante que tudo... até mais importante que o Senhor.", 0.6),
        F("d13c", "davi", "Eu quero amar o Senhor mais do que tudo de novo. E... por favor... me ajuda a encontrar o Algodão?", 1.0),
        M("estrela", 0.6), P(3.0), M("bee", 0.0), S("balido", "bee", 0, .18), P(1.8),
        M("corre", 0.2), P(2.6),
        F("d14", "davi", "Algodão! Calma, eu tô aqui! Eu tô aqui...", 0.1),
        M("abraco", 0.3), P(1.4),
        M("achou"), F("d15", "davi", "Obrigado, Deus! Obrigado!", 0.1),
        M("lambe", 0.2), S("balido", "lambe", 0, .45), P(1.0),
        M("chegam", 0.2), P(1.6),
        F("l5", "lucas", "Achou! Eeeee!", 0.1), P(2.0), M("fim"),
    ]),
    # ------------------------------------------------------------------ 6
    dict(id="c6", nome="Marta e Maria", musica=[("noite", "@ini"), ("biblico", "@betania"), ("noite", "@volta")], ambiente=[("grilos", "ini", "betania"), ("grilos", "volta", "fim")], itens=[
        M("ini"), P(1.2),
        F("d16", "davi", "Vô... eu fui muito bobo essa semana, né?", 0.2),
        F("v4", "vovo", "Você foi como todos nós às vezes somos, Davi. Sabe que isso aconteceu até com uma amiga de Jesus? Quer ouvir?", 0.6),
        F("d17", "davi", "Quero!", 0.3),
        M("transicao", 0.4), S("harpa", "transicao"), P(2.0), M("betania"),
        F("v5", "vovo", "Um dia, Jesus foi visitar a casa de duas irmãs: Marta e Maria.", 0.6), P(1.0),
        M("senta"),
        F("v6", "vovo", "A Maria se sentou bem pertinho de Jesus, pra ouvir cada palavra que Ele dizia.", 0.8), P(0.8),
        M("correria"),
        F("v7", "vovo", "Mas a Marta... ah, a Marta estava ocupadíssima! Era panela pra cá, pão pra lá, varrer, arrumar a mesa...", 0.3),
        S("panela", "correria", 4.0), S("panela", "correria", 6.5), P(1.6),
        F("mt1", "marta", "Senhor! Não se importa que minha irmã me deixou fazendo tudo sozinha? Manda ela me ajudar!", 0.3),
        F("j1", "jesus", "Marta, Marta... você está preocupada e agitada com muitas coisas. Mas só uma é realmente necessária. Maria escolheu a melhor parte, e ela não será tirada dela.", 1.0),
        M("martaSenta", 0.4), P(3.2),
        M("transicao2"), S("harpa", "transicao2"), P(2.0), M("volta"),
        F("d18", "davi", "Então... fazer comida não era errado?", 0.4),
        F("v8", "vovo", "Não era! Mas, naquele momento, Jesus estava ali, e a Marta estava tão ocupada que não tinha tempo pra Ele.", 0.3),
        F("d19", "davi", "Igual eu com o videogame...", 0.6),
        F("v9", "vovo", "Igualzinho.", 0.4), P(1.6), M("fim"),
    ]),
    # ------------------------------------------------------------------ 7
    dict(id="c7", nome="O pote do coração", musica=[("noite", "@ini")], ambiente=[("grilos", "ini", "fim")], itens=[
        M("ini"), P(0.8),
        F("v10", "vovo", "Davi, sabe como a gente mostra que ama alguém?", 0.2),
        F("d20", "davi", "Dando um abraço?", 0.3),
        F("v11", "vovo", "Também! Mas principalmente com o nosso tempo e a nossa atenção. Agora imagine que este pote é o seu coração.", 0.4),
        M("pote", 0.4), P(1.0), M("areia"), S("areia", "areia"), P(2.4), M("pedrinhas"), S("pedrinhas", "pedrinhas"), P(1.8),
        F("v12", "vovo", "A areia são as coisas legais: videogame, desenho, brincadeira. As pedrinhas são as pessoas que a gente ama: a mamãe, o Lucas, o Algodão. E a pedra dourada... é o nosso amor por Deus.", 0.2),
        M("tenta", 0.3), S("pedra", "tenta", 0.9), P(1.6),
        F("d21", "davi", "Ela não cabe!", 0.1),
        M("esvazia", 0.6), S("areia", "esvazia"), P(2.0),
        M("pedra1"), S("pedra", "pedra1", 0.8), P(1.8), M("pedrinhas2"), S("pedrinhas", "pedrinhas2"), P(1.8), M("areia2"), S("areia", "areia2"), P(3.0),
        F("d22", "davi", "Agora coube tudo!", 0.2), S("brilho", "d22", 0.2),
        M("volta", 0.8),
        F("v13", "vovo", "Jesus disse que o primeiro e maior mandamento é este: Amarás o Senhor, teu Deus, de todo o teu coração. De todo o coração, Davi. Não de um cantinho dele.", 0.4),
        F("d23", "davi", "Então eu não posso gostar do videogame?", 0.4),
        F("v14", "vovo", "Pode, sim! Ele é um presente. Mas a gente ama a Deus acima de todas as coisas, porque foi Ele quem nos amou primeiro e quem nos deu tudo de bom.", 0.3),
        F("v14b", "vovo", "E sabe o mais bonito? Quando Deus está em primeiro lugar, a gente aprende a amar todo o resto do jeito certo.", 0.5),
        M("abraca", 0.3),
        F("d24", "davi", "Amar a Deus acima de tudo... e aí sobra amor pra todo mundo!", 0.4),
        F("v15", "vovo", "É isso aí, campeão.", 0.3), P(2.0), M("fim"),
    ]),
    # ------------------------------------------------------------------ 8
    dict(id="c8", nome="Um novo dia", musica=[("noite", "@ini"), ("alegre", "@montagem")], ambiente=[("passaros", "ini", "fim")], itens=[
        M("ini"), P(1.0), M("espreguica"), P(2.0), M("olha"), P(2.4), M("ajoelha"), P(1.2),
        F("d25", "davi", "Bom dia, Deus! Eu te amo! Obrigado pelo Algodão, pela mamãe, pelo vovô, pelo Lucas... e pelo videogame também!", 0.2),
        M("montagem", 0.8), P(4.0), M("m2"), P(4.5), M("m3"), S("risada", "m3", 1.5, .0), P(5.0),
        M("narra"),
        F("n5", "narradora", "E o Davi aprendeu que amar a Deus acima de todas as coisas não deixa a vida menos divertida. Deixa o coração no lugar certo.", 0.2),
        P(2.0), M("fim"),
    ]),
    # ------------------------------------------------------------------ 9
    dict(id="c9", nome="Hora da Lição com o Vovô", musica=[("tema", "@ini"), ("alegre", "@fala"), ("oracao", "@oracao")], itens=[
        M("ini"), S("brilho", "ini", 0.8), P(4.0), M("fala"),
        F("v16", "vovo", "Oi, criançada! Que bom que você assistiu até aqui! Hoje a gente aprendeu uma coisa muito importante. Davi, você lembra qual é o primeiro e maior mandamento?", 0.4),
        F("d26", "davi", "Amar a Deus acima de todas as coisas!", 0.3),
        F("v17", "vovo", "Isso mesmo! E como a gente faz isso na prática? Eu vou te ensinar três jeitinhos. Conta comigo nos dedos!", 0.3),
        M("um", 0.5), S("plim", "um"),
        F("v18", "vovo", "Um: dar o nosso tempo pra Deus. Conversar com Ele em oração e ouvir o que Ele diz na Bíblia. Igual a Maria, que sentou pertinho de Jesus.", 0.3),
        M("dois", 0.6), S("plim", "dois"),
        F("v19", "vovo", "Dois: obedecer com alegria. Quando a gente ama alguém, quer fazer o que deixa essa pessoa feliz. Obedecer a Deus e aos pais é um jeito de dizer: eu te amo, Senhor.", 0.3),
        M("tres", 0.6), S("plim", "tres"),
        F("v20", "vovo", "Três: amar as pessoas. Jesus disse que o segundo mandamento é amar o próximo como a nós mesmos. Quem ama a Deus cuida da mamãe, do papai, dos amigos... e até da ovelhinha!", 0.3),
        M("bee", 0.2), S("balido", "bee", 0, .45), P(1.0),
        F("d27", "davi", "E se a gente esquecer, igual eu esqueci?", 0.3),
        F("v21", "vovo", "Aí a gente faz igual você fez no morro: conversa com Deus, pede desculpas e recomeça. Deus nunca para de amar a gente. Lembra? Nós amamos porque Ele nos amou primeiro.", 0.4),
        M("versiculo", 0.6),
        F("v22", "vovo", "Agora vamos decorar o versículo juntos, com gestos! Fica de pé aí!", 0.2),
        F("g1", "davi", "Amarás o Senhor, teu Deus,", 0.8), F("g2", "davi", "de todo o teu coração,", 0.4),
        F("g3", "davi", "de toda a tua alma", 0.4), F("g4", "davi", "e de todo o teu entendimento.", 0.4),
        F("g5", "davi", "Mateus vinte e dois, trinta e sete!", 0.5),
        F("v23", "vovo", "De novo, mais rápido!", 0.8),
        F("h1", "davi", "Amarás o Senhor, teu Deus,", 0.4, rate="+30%"), F("h2", "davi", "de todo o teu coração,", 0.15, rate="+30%"),
        F("h3", "davi", "de toda a tua alma", 0.15, rate="+30%"), F("h4", "davi", "e de todo o teu entendimento.", 0.15, rate="+30%"),
        F("h5", "davi", "Mateus vinte e dois, trinta e sete!", 0.2, rate="+30%"),
        M("desafio", 1.0), S("brilho", "desafio"),
        F("v24", "vovo", "E agora, um desafio pra você! Durante esta semana, quando acordar, antes de pegar qualquer brinquedo, celular ou tablet, dê os primeiros cinco minutinhos do seu dia pra Deus.", 0.3),
        F("v24b", "vovo", "Pode ser uma oração, uma música ou um versículo. Peça pro papai ou pra mamãe te ajudar!", 0.3),
        F("d30", "davi", "E a cada dia que você conseguir, pinta um coraçãozinho! Eu já pintei o meu de hoje!", 0.4),
        M("pinta", 0.0), S("plim", "d30", 3.2),
        M("oracao", 1.0),
        F("v25", "vovo", "Pra terminar, vamos orar juntos? Fecha os olhinhos e repete comigo:", 0.3),
        F("o1", "vovo", "Querido Deus...", 1.0), P(2.0),
        F("o2", "vovo", "Obrigado porque o Senhor me amou primeiro.", 0.1), P(3.0),
        F("o3", "vovo", "Eu quero amar o Senhor acima de todas as coisas.", 0.1), P(3.2),
        F("o4", "vovo", "Me ajuda a te dar o meu tempo,", 0.1), P(2.4),
        F("o5", "vovo", "a obedecer com alegria", 0.1), P(2.2),
        F("o6", "vovo", "e a amar as pessoas.", 0.1), P(2.2),
        F("o7", "vovo", "Em nome de Jesus, amém!", 0.1), P(2.2),
        F("a1", "davi", "Amém!", 0.2), F("a2", "vovo", "Amém!", 0.0, junto=True),
        M("bem", 0.4), S("balido", "bem", 0, .45), P(2.6), M("fim"),
    ]),
    # ------------------------------------------------------------------ 10
    dict(id="c10", nome="Encerramento", musica=[("tema", "@ini")], ambiente=[("passaros", "ini", "fim")], itens=[
        M("ini"), P(1.0),
        F("d32", "davi", "Tchau, pessoal! Não esquece do desafio, hein!", 0.2),
        F("v27", "vovo", "E lembre-se: Deus em primeiro lugar no seu coração!", 0.3),
        M("versiculo", 0.4), P(6.0), M("fim"),
    ]),
]
