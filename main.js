const { createApp } = Vue;

createApp({
    data() {
        return {
            contador: 0,
            menuAberto: false,

            form: {
                nome: "",
                turma: "",
            },

            inscritos: [],
        };
    },

    methods: {
        alternarMenu() {
            this.menuAberto = !this.menuAberto;

            if (this.menuAberto) {
                this.$nextTick(() => this.$refs.primeiroLink?.focus());
            }
        },

        fecharMenu() {
            if (!this.menuAberto) return;

            this.menuAberto = false;
            this.$nextTick(() => this.$refs.botaoMenu?.focus());
        },

        aoClicarLink(event) {
            const idDestino = event.currentTarget.hash.slice(1);
            const destino = document.getElementById(idDestino);

            this.menuAberto = false;

            this.$nextTick(() => {
                destino?.focus({ preventScroll: true });
            });
        },

        adicionarInscrito() {
            if (!this.form.nome || !this.form.turma) return;

            this.inscritos.push({
                nome: this.form.nome,
                turma: this.form.turma,
            });

            this.form.nome = "";
            this.form.turma = "";
        },

        removerInscrito(idx) {
            this.inscritos.splice(idx, 1);
        },
    },
}).mount("#app");
