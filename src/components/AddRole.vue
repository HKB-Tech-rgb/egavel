<template>
    <v-layout>
        <v-flex xs4, >
            <YesNoDiag :dialog="dialog" :msg="msg"  @descision="deleteCheck"></YesNoDiag>
            <Panel title="Maintain User Roles" @del-form="delRole">
                <v-card-text>
                    <v-form v-model="valid" lazy-validation ref="form">
                        <v-select
                            item-text='name'
                            item-value='val'
                            v-model="selectRole"
                            :items="roles"
                            :readonly="readOnly"
                            label="Select available user roles"
                        ></v-select>
                        <v-text-field
                            v-model="userRole.RoleDescription"
                            label="role description"
                            :rules="required"
                            >
                        </v-text-field>
                        <v-card-actions>
                            <v-btn color="indigo" dark @click="create">Create</v-btn>
                            <v-btn color="indigo" dark @click="update">Update</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>    
            </Panel>
        </v-flex>
     </v-layout>
</template>
<script>
import Panel from '@/components/Panel';
import YesNoDiag from '@/components/YesNoDiag.vue';

export default {
    data(){
        return{
            userRole:{
               id:0,
               RoleDescription: ''
            },
            roles: [],
            selectRole:'',
            readOnly: false,
            valid: '',
            dialog: false,
            msg:'About to delete Are you sure? ',
            required: [(v) => !!v || 'This field is required'] 
        }
    },
    components:{
        Panel,
        YesNoDiag
    },
    methods:{
        async create() {
            try {
                if (this.$refs.form.validate()){
                    try {
                        this.$store.dispatch('createRole', this.userRole).then( () => {
                               this.$router.push('/opencases');

                           }, error => {
                             console.log('Got Nowt Data '+ error);
                           });
                        } catch (error) {
                            console.log(error);
                        }
                }
            } catch (err) {
                console.log('Error while creating new Case ' + err);
            }
        },
        async update() {
            try {
                if (this.$refs.form.validate()){
                    try {
                        this.$store.dispatch('updateRole', this.userRole).then( () => {
                               this.$router.push('/opencases');

                           }, error => {
                             console.log('Got Nowt Data '+ error);
                           });
                        } catch (error) {
                            console.log(error);
                        }
                }
            } catch (err) {
                console.log('Error while creating new Case ' + err);
            }
        },
        async delRole(del){
            if (del){
                this.dialog = true;
            }
            
        },
        async deleteCheck(yesNo){
            this.dialog = false;
            if (yesNo){
                var url = `/roles/${this.userRole.id}`
                if (this.userRole.id > 0){
                    await this.$store.dispatch('delFile', url);
                }
                
            }
        }
    },
    watch: { 
        'selectRole': function(val) {
            this.roles.forEach((role)=>{
                if (role.val==val){
                    this.userRole.RoleDescription = role.name;
                    this.userRole.id = role.val;
                }
            }); 
        }
    },
    async created(){
        await this.$store.dispatch('getAllRoles').then((roles) => {
            roles.forEach(role=>{
                 this.roles.push({name:role.RoleDescription, val:role.id});
            })
        });
    }
}
</script>
<style scoped>

</style>
